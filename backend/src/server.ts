import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "./graphql/index.js";
import { prisma } from "./db.js";
import type { PrismaClient } from "@prisma/client";
import "dotenv/config";
import express, { Request } from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import compression from "compression";
import path from "path";
import fs from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";

// Apollo context shared with resolvers
type Context = {
  prisma: PrismaClient;
  userId?: number;
};

const app = express();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const start = async () => {
  await server.start();

  // GraphQL endpoint with CORS, JSON parsing, and auth-aware context
  app.use(
    "/graphql",
    cors({
      origin: [
        "http://localhost:4173",
        "http://localhost:5173",
        "https://studio.apollographql.com",
        "http://it2810-01.idi.ntnu.no",
      ],
      credentials: true,
    }),
    express.json(),
    expressMiddleware<Context>(server, {
      context: async ({ req }: { req: Request }): Promise<Context> => {
        const auth = req.headers.authorization;
        const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;

        let userId: number | undefined = undefined;
        if (token) {
          try {
            const decoded = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as JwtPayload & {
              userId?: number;
            };
            if (typeof decoded.userId === "number") {
              userId = decoded.userId;
            }
          } catch (err) {
            console.log("Invalid token", err);
          }
        }

        return { prisma, userId };
      },
    }),
    compression()
  );

  // Simple health endpoint
  app.get("/", (_req, res) => {
    res.send("Server is running");
  });

  if (process.env.SERVE_STATIC === "true") {
    const distDir = path.resolve(process.cwd(), "frontend/dist");
    if (fs.existsSync(distDir)) {
      app.use(
        express.static(distDir, {
          setHeaders(res, filePath) {
            if (filePath.endsWith("index.html")) {
              res.setHeader(
                "Cache-Control",
                "no-cache, no-store, must-revalidate"
              );
              return;
            }

            const basename = path.basename(filePath);
            const hasHash = /-[0-9a-f]{6,}\./i.test(basename);
            if (hasHash) {
              res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable"
              );
            } else {
              res.setHeader("Cache-Control", "public, max-age=3600");
            }
          },
        })
      );
      console.log(`Serving static files from ${distDir} with cache headers`);
    } else {
      console.warn(
        `SERVE_STATIC=true but ${distDir} not found; skipping static middleware`
      );
    }
  }

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
};

start();
