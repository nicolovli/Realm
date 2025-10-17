import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/index.js";
import { prisma } from "./db.js";
import "dotenv/config";
import express from "express";
import { auth } from "express-openid-connect";
import cors from "cors";

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET!,
  baseURL: "http://it2810-01.idi.ntnu.no/project2",
  clientID: process.env.AUTH0_CLIENT_ID!,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN!}`,
  session: {
    cookie: {
      secure: false,
    },
  },
};

app.use(auth(config));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studio.apollographql.com",
      "http://it2810-01.idi.ntnu.no",
    ],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ prisma, user: req.oidc.user }),
});

const start = async () => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(
      `Server ready at http://localhost:${port}${server.graphqlPath}`,
    );
  });
};

start();
