export const schema = `#graphql
    type Issue {
        id: ID!
        name: String!
        content: String!
        createdAt: String!
        userId: String!
        user: User!
        status: IssueStatus
        projectId: String!
    }

    enum IssueStatus {
        BACKLOG
        TODO
        INPROGRESS
        DONE
    }

    input CreateIssueInput {
        name: String!
        content: String!
        status: IssueStatus
    }

    type User {
        id: ID!
        email: String!
        token: String!
        createdAt: String!
        issues: [Issue]! # add issues field
    }

    input IssuesFilterInput {
        statuses: [IssueStatus!]
    }

    input AuthInput {
        email: String!
        password: String!
    }
    
    input EditIssueInput {
        name: String
        content: String
        status: IssueStatus
        id: ID!
    }
    
    type Query {
        me: User
        issues(input: IssuesFilterInput): [Issue]!
    }

    type Mutation {
        signin(input: AuthInput!): User
        createUser(input: AuthInput!): User
        createIssue(input: CreateIssueInput!): Issue!
        editIssue(input: EditIssueInput!): Issue!
    }

`
