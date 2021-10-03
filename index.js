const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    title: String!
    author: String!
  }
  type Author {
    name: String!
    books: [Book]
  }
  type Query {
    books(number: Int!): [Book!]
  }
  type Query {
    authors: [Author]
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const authors = [
  {
    name: "Kate Chopin",
    books: [
      { title: "The Awakening", author: "Kate Chopin" },
      { title: "Atomic Habits", author: "Kate Chopin" },
    ],
  },
  {
    name: "Paul Auster",
    books: [{ title: "City of Glass", author: "Paul Auster" }],
  },
];

const resolvers = {
  Query: {
    books: (number) => books.slice(0, 1),
    authors: () => authors,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
