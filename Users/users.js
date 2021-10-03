"use strict";
const { ApolloServer } = require("apollo-server");
const { error } = require("console");
const fs = require("fs");
const path = require("path");
const EasyGraphQLTester = require("easygraphql-tester");
const { iterateObserversSafely } = require("@apollo/client/utilities");

const userSchema = fs.readFileSync(
  path.join(__dirname, "usersSchema.graphql"),
  "utf8"
);

let posts = [];

let users = [
  {
    id: "user-0",
    name: "Sanjana",
    mail: "sanjana@mail.com",
  },
];

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => {
      const foundUser = users.find((user) => user.id === args.id);
      if (!foundUser) {
        return error(`User with id ${args.id} does not exist`);
      }
      return foundUser;
    },
    posts: () => posts,
    post: (parent, args) => {
      const foundPost = posts.find((post) => post.id === args.id);
      if (!foundPost) {
        console.log(`Post with id ${args.id} does not exist`);
      }
      return foundPost;
    },
    userPosts: (parent, args) => {
      const userPosts = posts.filter((post) => post.userId === args.userId);
      return userPosts;
    },
  },
  Mutation: {
    postUser: (parent, args) => {
      let idCount = users.length;

      const user = {
        id: `user-${idCount++}`,
        name: args.name,
        mail: args.mail,
      };
      users.push(user);
      return user;
    },
    updateUser: (parent, args) => {
      const index = users.findIndex((user) => user.id === args.id);
      if (args.name) users[index].name = args.name;

      if (args.mail) users[index].mail = args.mail;

      return users[index];
    },
    deleteUser: (parent, args) => {
      const user = users.find((eachUser) => eachUser.id === args.id);
      users = users.filter((eachUser) => eachUser.id !== args.id);
      return user;
    },
    createPost: (parent, args) => {
      let idCount = posts.length;
      const post = {
        id: `post-${idCount++}`,
        title: args.title,
        description: args.description,
        userId: args.userId,
      };
      posts.push(post);
      return post;
    },
    updatePost: (parent, args) => {
      const index = posts.findIndex((post) => post.id === args.id);
      if (args.title) posts[index].title = args.title;
      if (args.description) posts[index].description = args.description;
      return posts[index];
    },
    deletePost: (parent, args) => {
      const post = posts.find((post) => post.id === args.id);
      posts = posts.filter((post) => post.id !== args.id);
      return post;
    },
  },
};

const server = new ApolloServer({
  typeDefs: userSchema,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));
module.exports = {
  resolvers,
};

// query{
//   users {
//     id
//     name
//   }
//   userPosts(userId: "user-0") {
//     id
//     title
//     description
//   }
// }

// query{
//   posts{
//     id
//     title
//   }
// }

// query{
//   post(id:"post-0"){
//     id
//     title
//   }
// }

// query{
//   user(id:"user-0"){
//     name
//     mail
//   }
// }

// mutation{
//   postUser(name: "Alice", mail: "alice@mail.com") {
//     id
//     name
//   }
// }

// mutation{
//   updateUser(id:"user-1",mail:"alice123@mail.com"){
//     id
//     name
//     mail
//   }
// }

// mutation{
//   deleteUser(id:"user-1"){
//     name
//     id
//   }
// }

// mutation{
//   createPost(title: "first post", description: "this is first post", userId: "user-0") {
//     id
//     title
//     description
//   }
// }

// mutation{
//   updatePost(id:"post-0",title:"updated title"){
//     id
//     title
//   }
// }

// mutation{
//   deletePost(id:"post-0"){
//     id
//     title
//     description
//   }
// }
