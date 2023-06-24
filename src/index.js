const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')

const fs = require('fs');
const path = require('path');


let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }]
  
  // 1
  const resolvers = {
    Query: {
      info: () => `This is the API of a Hackernews Clone`,
      feed: async (parent, args, context) => {
        return context.prisma.link.findMany()
      },
    },
    Mutation: {
        post: (parent, args, context, info) => {
          const newLink = context.prisma.link.create({
            data: {
              url: args.url,
              description: args.description,
            },
          })
          return newLink
        },
      },
  }

  const prisma = new PrismaClient()
  
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
    ),
    resolvers,
    context: {
        prisma,
      }
  })
// 1
// const typeDefs = `
//   type Query {
//     info: String!
//     feed: [Link!]!
//   }

//   type Mutation {
//     post(url: String!, description: String!): Link!
//   }

//   type Link {
//     id: ID!
//     description: String!
//     url: String!
//   }
// `

// 1

// let links = [{
//     id: 'link-0',
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL'
//   }]
  
//   const resolvers = {
//     Query: {
//       info: () => `This is the API of a Hackernews Clone`,
//       // 2
//       feed: () => links,
//     },
//     // 3
//     Link: {
//       id: (parent) => parent.id,
//       description: (parent) => parent.description,
//       url: (parent) => parent.url,
//     }
//   }

// 3
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );