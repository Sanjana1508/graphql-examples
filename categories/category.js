const { ApolloServer } = require("apollo-server");
const { error } = require("console");
const fs = require("fs");
const path = require("path");
const Category = require("./categoryModel");

const categorySchema = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

let categories = [
  new Category("c1", "Italian", "#f5428d"),
  new Category("c2", "Quick & Easy", "#f54252"),
  new Category("c3", "Hamburgers", "#f5a442"),
  new Category("c4", "German", "#f5d142"),
  new Category("c5", "Light & Lovely", "#368dff"),
  new Category("c6", "Exotic", "#41d95d"),
  new Category("c7", "Breakfast", "#9eecff"),
  new Category("c8", "Asian", "#b9ffb0"),
  new Category("c9", "French", "#ffc7ff"),
  new Category("c10", "Summer", "#47fced"),
  new Category("c11", "Mexican", "#f5428c"),
  new Category("c12", "Lunch", "#f5428e"),
];

const resolvers = {
  Query: {
    getCategories: () => categories,
  },
  Mutation: {
    createCategory: (_, args) => {
      const newCategory = new Category(args.id, args.title, args.color);
      categories.push(newCategory);
      return newCategory;
    },
  },
};

const server = new ApolloServer({
  typeDefs: categorySchema,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));
