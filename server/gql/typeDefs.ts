import { gql } from 'apollo-server'


export const typeDefs = gql`
scalar Date

type Event {
  _id:ID!
  text:String!
}

type Day {
  _id:ID!
  events:[Event!]!
  dayIndex:Int!
  date:Date!
}

type Week {
  _id:ID!
  days:[Day]!
  weekNumber:Int!
  year:Int!
}

type Query {
 getWeek(date:Date!):[Week!]!
}

type Mutation {
  addEvent(date:Date!,text:String!):Event!
  updateEvent(id:ID!,text:String!):Event!
  deleteEvent(id:ID!):Event!
}
`