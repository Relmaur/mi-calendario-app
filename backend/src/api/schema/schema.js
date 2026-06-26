const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        id: ID!
        userName: String!
        email: String!
        subscription: String
        schedules: [Schedule!]!
    }

    type Schedule {
        id: ID!
        title: String!
        description: String!
        date: String
        week: String
        user: User!
    }

    type AuthPayload {
        accessToken: String!
        refreshToken: String!
        user: User!
    }

    type Week {
        week: String!
    }

    type Query {

        user(id: ID!): User!
        users: [User!]!
        schedules: [Schedule!]!
        week(id: ID!): String!
    }

    type Mutation {
        
        updateWeek(id: ID!, week: String!, userId: ID!): Week!
        
        register(email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        refreshToken(token: String!): AuthPayload!
    }
`;

module.exports = typeDefs;

