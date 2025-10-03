import { gql } from 'apollo-server'
import { prisma } from './db'

interface PostArgs {
  id: string
}

interface CreateDraftArgs {
  title: string
  content?: string
}

interface PublishArgs {
  id: string
}

export const typeDefs = gql`
  type Post {
    content: String
    id: ID!
    published: Boolean!
    title: String!
  }

  type Query {
    feed: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createDraft(content: String, title: String!): Post!
    publish(id: ID!): Post
  }
`

export const resolvers = {
  Query: {
    feed: () => {
      return prisma.post.findMany({
        where: { published: true },
      })
    },
    post: (_parent: unknown, args: PostArgs) => {
      return prisma.post.findUnique({
        where: { id: Number(args.id) },
      })
    },
  },
   Mutation: {
    createDraft: (_parent: unknown, args: CreateDraftArgs) => {
      return prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
        },
      })
    },
    publish: (_parent: unknown, args: PublishArgs) => {
      return prisma.post.update({
        where: {
          id: Number(args.id),
        },
        data: {
          published: true,
        },
      })
    },
  },
}