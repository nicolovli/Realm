import { userResolvers } from "../graphql/user/userResolvers.js";
import {
  generateToken,
  hashPassword,
  verifyPassword,
  handlePrismaUniqueError,
} from "../graphql/user/index.js";

jest.mock("../graphql/game/index.js", () => ({
  clearGamesCache: jest.fn(),
}));

jest.mock("../graphql/user/index.js", () => ({
  generateToken: jest.fn(),
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  handlePrismaUniqueError: jest.fn(),
}));

jest.mock("../db.js", () => {
  return {
    prisma: {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      review: {
        findMany: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
      game: {
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    },
  };
});

import { prisma } from "../db.js";

const mockPrisma = prisma as unknown as {
  user: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    count: jest.Mock;
  };
  review: {
    findMany: jest.Mock;
    count: jest.Mock;
    aggregate: jest.Mock;
  };
  game: { update: jest.Mock };
  $transaction: jest.Mock;
};

const createContext = (userId?: number) => ({ userId });

describe("userResolvers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("users", () => {
    it("returns minimal user projection", async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 1, username: "alice", email: "alice@example.com" },
      ]);
      const result = await userResolvers.Query.users();
      expect(result).toEqual([
        { id: 1, username: "alice", email: "alice@example.com" },
      ]);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, username: true, email: true },
      });
    });
  });

  describe("me", () => {
    it("returns null when unauthenticated", async () => {
      const result = await userResolvers.Query.me(
        undefined,
        undefined,
        createContext(),
      );
      expect(result).toBeNull();
    });

    it("returns user with favorites when authenticated", async () => {
      const favorites = [
        {
          id: 10,
          sid: 101,
          name: "Game",
          image: null,
          descriptionShort: "Fun",
        },
      ];
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: "bob",
        email: "bob@example.com",
        favorites,
      });
      const result = await userResolvers.Query.me(
        undefined,
        undefined,
        createContext(1),
      );
      expect(result?.favorites).toEqual(favorites);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          username: true,
          email: true,
          favorites: {
            select: {
              id: true,
              sid: true,
              name: true,
              image: true,
              descriptionShort: true,
            },
          },
        },
      });
    });
  });

  describe("userFavorites", () => {
    it("returns empty array when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await userResolvers.Query.userFavorites(undefined, {
        userId: 99,
      });
      expect(result).toEqual([]);
    });

    it("returns favorites list for existing user", async () => {
      const favorites = [
        {
          id: 2,
          name: "X",
          image: null,
          descriptionShort: "Desc",
          publishedStore: null,
        },
      ];
      mockPrisma.user.findUnique.mockResolvedValue({ favorites });
      const result = await userResolvers.Query.userFavorites(undefined, {
        userId: 2,
      });
      expect(result).toEqual(favorites);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        select: {
          favorites: {
            select: {
              id: true,
              name: true,
              image: true,
              descriptionShort: true,
              publishedStore: true,
            },
          },
        },
      });
    });
  });
});

describe("userResolvers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("creates user with normalized lowercase fields and hashed password", async () => {
      (hashPassword as jest.Mock).mockResolvedValue("hashed");
      mockPrisma.user.create.mockResolvedValue({
        id: 5,
        username: "testuser",
        email: "test@example.com",
        password: "hashed",
      });
      const result = await userResolvers.Mutation.createUser(undefined, {
        username: "TestUser",
        email: "TEST@EXAMPLE.COM",
        password: "secret123",
      });
      expect(hashPassword).toHaveBeenCalledWith("secret123");
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          email: "test@example.com",
          password: "hashed",
        },
      });
      expect(result?.id).toBe(5);
    });

    it("delegates unique constraint errors to handler", async () => {
      (hashPassword as jest.Mock).mockResolvedValue("hashed");
      const err = { code: "P2002" };
      mockPrisma.user.create.mockRejectedValue(err);
      (handlePrismaUniqueError as jest.Mock).mockImplementation(() => {
        throw new Error(
          "Ah! This username is already taken. Time to get creative!",
        );
      });
      await expect(
        userResolvers.Mutation.createUser(undefined, {
          username: "Existing",
          email: "existing@x.com",
          password: "abc12345",
        }),
      ).rejects.toThrow(
        "Ah! This username is already taken. Time to get creative!",
      );
      expect(handlePrismaUniqueError).toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("logs in valid user and returns token", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 9,
        username: "loginuser",
        email: "login@x.com",
        password: "hashed",
      });
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("token123");
      const result = await userResolvers.Mutation.loginUser(undefined, {
        username: "LoginUser",
        password: "pw",
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: "loginuser" },
      });
      expect(verifyPassword).toHaveBeenCalledWith("pw", "hashed");
      expect(generateToken).toHaveBeenCalledWith(9, "loginuser");
      expect(result.token).toBe("token123");
      expect(result.user).toEqual({
        id: 9,
        username: "loginuser",
        email: "login@x.com",
      });
    });

    it("throws when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        userResolvers.Mutation.loginUser(undefined, {
          username: "Missing",
          password: "pw",
        }),
      ).rejects.toThrow("Hmm… we can’t seem to find a player by that name.");
    });

    it("throws on invalid password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        username: "name",
        email: "e@e.com",
        password: "hashed",
      });
      (verifyPassword as jest.Mock).mockResolvedValue(false);
      await expect(
        userResolvers.Mutation.loginUser(undefined, {
          username: "name",
          password: "wrong",
        }),
      ).rejects.toThrow("Oops! That password doesn’t unlock this treasure.");
    });
  });

  describe("updateUser", () => {
    it("throws when unauthenticated", async () => {
      await expect(
        userResolvers.Mutation.updateUser(
          undefined,
          { username: "x" },
          createContext(),
        ),
      ).rejects.toThrow("You must be logged in to update your profile.");
    });

    it("throws when user missing", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        userResolvers.Mutation.updateUser(
          undefined,
          { username: "x" },
          createContext(1),
        ),
      ).rejects.toThrow("Hmm… we can’t seem to find a player by that name.");
    });

    it("throws when no changes provided", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        username: "old",
        email: "old@x.com",
      });
      await expect(
        userResolvers.Mutation.updateUser(undefined, {}, createContext(1)),
      ).rejects.toThrow("No changes were provided to update.");
    });

    it("validates username length", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        username: "old",
        email: "old@x.com",
      });
      await expect(
        userResolvers.Mutation.updateUser(
          undefined,
          { username: "ab" },
          createContext(1),
        ),
      ).rejects.toThrow("Username must be at least 3 characters long.");
    });

    it("validates password length", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        username: "old",
        email: "old@x.com",
      });
      await expect(
        userResolvers.Mutation.updateUser(
          undefined,
          { password: "123" },
          createContext(1),
        ),
      ).rejects.toThrow("Password must be at least 6 characters long.");
    });

    it("updates changed fields and hashes password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        username: "old",
        email: "old@x.com",
      });
      (hashPassword as jest.Mock).mockResolvedValue("newhash");
      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        username: "newname",
        email: "new@x.com",
      });
      const result = await userResolvers.Mutation.updateUser(
        undefined,
        { username: "NewName", email: "New@X.com", password: "abcdef" },
        createContext(1),
      );
      expect(hashPassword).toHaveBeenCalledWith("abcdef");
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { username: "newname", email: "new@x.com", password: "newhash" },
        select: { id: true, username: true, email: true },
      });
      expect(result).toEqual({
        id: 1,
        username: "newname",
        email: "new@x.com",
      });
    });

    it("propagates unique constraint through handler", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        username: "old",
        email: "old@x.com",
      });
      (hashPassword as jest.Mock).mockResolvedValue("hash");
      const err = { code: "P2002" };
      mockPrisma.user.update.mockRejectedValue(err);
      (handlePrismaUniqueError as jest.Mock).mockImplementation(() => {
        throw new Error(
          "Ah! This username is already taken. Time to get creative!",
        );
      });
      await expect(
        userResolvers.Mutation.updateUser(
          undefined,
          { username: "NewName" },
          createContext(1),
        ),
      ).rejects.toThrow(
        "Ah! This username is already taken. Time to get creative!",
      );
      expect(handlePrismaUniqueError).toHaveBeenCalled();
    });
  });
});

describe("User field resolvers", () => {
  afterEach(() => jest.clearAllMocks());

  it("returns user reviews list", async () => {
    mockPrisma.review.findMany.mockResolvedValue([
      {
        id: 1,
        description: "Nice",
        star: 5,
        gameId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const result = await userResolvers.User.reviews({ id: 1 });
    expect(result).toHaveLength(1);
    expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      select: {
        id: true,
        description: true,
        star: true,
        gameId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it("returns empty list when no reviews", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    const result = await userResolvers.User.reviews({ id: 42 });
    expect(result).toEqual([]);
  });
});
