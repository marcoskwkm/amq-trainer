import { Express } from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'

export const setupGraphQL = (app: Express) => {
  const schema = buildSchema(`
    type Query {
      hello: String
    }
  `)

  const root = {
    hello: () => {
      return 'Hello, world!'
    },
  }

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
  }))
}
