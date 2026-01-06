import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});