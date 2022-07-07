import { ApolloServer } from 'apollo-server'
import { typeDefs } from './gql/typeDefs'
import { resolvers } from './gql/resolvers'
import mongoose from "mongoose";
import models from './models'

const port = process.env.PORT || 4000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models }
  }
})

const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_HOST ||
  'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/planner'


const dbConnect = (url:string) => {
  mongoose.connect(url)
  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database ${url}`)
  })
}

server.listen({port:port}).then(({ url }) => {
  dbConnect(mongoUrl)
  console.log(`🚀  Server ready at ${url}`);
});

