// import { ApolloClient, InMemoryCache } from '@apollo/client/core/core.cjs';
// import { HttpLink } from "@apollo/client/link/http/http.cjs";

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

const httpLink = new createHttpLink({
    uri: 'http://localhost:4001/graphql',
});

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default apolloClient