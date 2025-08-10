import { encode } from "base-64";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const defaultSignatureCode = encode("solvprotocol");

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    headers: {
      Authorization: defaultSignatureCode
    }
  }),
  cache: new InMemoryCache()
});

export default client;
