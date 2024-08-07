"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setVerbosity } from "ts-invariant";
setVerbosity("debug");

function makeClient() {
  const httpLink = new HttpLink({
    // uri: "https://nestapp-j6j9.onrender.com/graphql",
    uri: "https://nestapp-j6j9.onrender.com/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
