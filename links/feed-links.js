const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");
const { error } = require("console");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");
const Query = require("./resolvers/query");
const Mutation = require("./resolvers/mutation");
const User = require("./resolvers/user");
const Link = require("./resolvers/link");

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));

// query {
//   feed {
//     description
//     id

//   }
// }

// query{
//   feed{
//     id
//   }
// }

// query{
//   link(id: "link-0") {
//     id
//     url
//   }
// }
// mutation {
//   post(url: "www.prisma.io", description: "Prisma replaces traditional ORMs") {
//     id
//   }
// }

// mutation{
//   updateLink(id:"link-1",url: "www.prisma.com",description: "Prisma") {
//     id
//     url
//     description
//   }
// }

// mutation{
//   deleteLink(id:"link-1"){
//     id
//   }
// }
