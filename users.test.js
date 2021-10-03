const fs = require("fs");
const path = require("path");
const EasyGraphQLTester = require("easygraphql-tester");

const userSchema = fs.readFileSync(
  path.join(__dirname, "Users", "usersSchema.graphql"),
  "utf8"
);

const { resolvers } = require("./Users/users");

describe("Test queries,mutations", () => {
  let tester;
  before(() => {
    tester = new EasyGraphQLTester(userSchema, resolvers);
  });
  it("users query", () => {
    const usersQuery = `
        query {
          users{
            id
            name
            mail
          }
        }
      `;
    tester.test(true, usersQuery);
  });

  it("user query", () => {
    const userQuery = `
      query{
        user(id:"user-0"){
          id
          name
        }
      }
    `;
    tester.test(true, userQuery);
  });

  it("test user fixture", () => {
    const userQuery = `
      query{
        user(id:"user-0"){
          id
          name
        }
      }
    `;
    tester.test(true, userQuery);
    const fixture = {
      data: {
        user: {
          id: "user-0",
          name: "bob",
        },
      },
    };
  });

  it("invalid users query", () => {
    const invalidUsersQuery = `
      query{
        users{
          id
          name
          phoneNumber
        }
      }
    `;
    tester.test(false, invalidUsersQuery);
  });

  it("invalid user query", () => {
    const invalidUserQuery = `
      query{
        user(id:"user-0"){
          id
          address
        }
      }
    `;
    tester.test(false, invalidUserQuery);
  });

  it("inavlid user id", () => {
    const invalidIdQuery = `
      query{
        user(id:1){
          id
          name
        }
      }
    `;
    tester.test(true, invalidIdQuery);
  });
});

describe("test mutation", () => {
  let tester;
  before(() => {
    tester = new EasyGraphQLTester(userSchema, resolvers);
  });
  it("test post user", () => {
    const postUserMutation = `
     mutation($name:String!,$mail:String!){
      postUser(name: $name, mail: $mail) {
        id
        name
      }
    }
  `;
    tester.test(true, postUserMutation, {
      name: "Alice",
      mail: "alice@mail.com",
    });
  });

  it("test invalid post user", () => {
    const invalidPostMutation = `
      mutation($name:String!,$mail:String!){
      postUser(name: $name, mail: $mail) {
        id
        name
      }
    }
  `;
    tester.test(false, invalidPostMutation, {
      name: "Alice",
      phoneNumber: "9876543210",
    });
  });

  it("test update user", () => {
    const updateUserMutation = `
      mutation($id:ID!,$mail:String){
      updateUser(id:$id,mail:$mail){
        id
        name
        mail
      }
    }
    `;
    tester.test(true, updateUserMutation, {
      id: "user-1",
      mail: "alice123@mail.com",
    });
  });

  it("test invalid update user", () => {
    const invalidUpdateMutation = `
      mutation($id:ID!,$phone:String){
        updateUser(id:$id,phone:$phone){
          id
          name
        }
    }
    `;
    tester.test(false, invalidUpdateMutation, {
      id: "user-1",
      mail: "alice123@mail.com",
    });
  });

  it("test delete user", () => {
    const deleteUserMutation = `
      mutation($id:ID!){
        deleteUser(id:$id){
          name
          id
        }
      }
    `;
    tester.test(true, deleteUserMutation, { id: "user-1" });
  });

  it("test invalid user", () => {
    const invalidDeleteMutation = `
       mutation{
        deleteUser{
          name
          id
        }
      }
    `;
    tester.test(false, invalidDeleteMutation, { id: "user-1" });
  });
});
