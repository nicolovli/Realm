import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";
import { PrismaError } from "./userTypes.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export async function handlePrismaUniqueError(
  error: unknown,
  username: string,
  email: string,
) {
  const prismaError = error as PrismaError;
  if (prismaError.code === "P2002") {
    const existingUsers = await prisma.user.findMany({
      where: { OR: [{ username }, { email }] },
      select: { username: true, email: true },
    });

    const usernameTaken = existingUsers.some(
      (u) => u.username.toLowerCase() === username,
    );
    const emailTaken = existingUsers.some(
      (u) => u.email.toLowerCase() === email,
    );

    if (usernameTaken && emailTaken) {
      throw new Error(
        "Oops! Both username and email are already claimed by another player.",
      );
    } else if (usernameTaken) {
      throw new Error(
        "Ah! This username is already taken. Time to get creative!",
      );
    } else if (emailTaken) {
      throw new Error(
        "Hmm… this email is already on the scroll. Try another one!",
      );
    } else {
      throw new Error("A mysterious force blocks your path. Please try again.");
    }
  }
  throw new Error(
    "Something went wrong while forging your account. Give it another shot!",
  );
}
