export const schema = `#graphql
    type User {
        id: ID!
        email: String!
        token: String!
        createdAt: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }
    
    
    type Query {
        me: User
    }

    type Mutation {
        signin(input: AuthInput!): User
        createUser(input: AuthInput!): User
    }
`
