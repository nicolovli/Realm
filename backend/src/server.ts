import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import 'dotenv/config';

const port = process.env.PORT || 8088

new ApolloServer({ typeDefs }).listen({ port }, () =>
  console.log(`Server ready at: http://localhost:${port}`),
)