"use server";
import { ApolloError, gql } from "@apollo/client";
import { getClient } from "@/lib/client";
import { cookies } from "next/headers";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNIN = gql`
  mutation signIn(
    $email: String!
    $password: String!
    $lastname: String!
    $firstname: String!
  ) {
    signIn(
      email: $email
      password: $password
      lastname: $lastname
      firstname: $firstname
    ) {
      token
    }
  }
`;

export const login = async (email: string, password: string) => {
  const client = getClient();
  const requestCookies = cookies();

  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: { email, password },
    });
    if (data) {
      requestCookies.set("token_graphql", data.login.token);
      return {
        error: null,
      };
    }
  } catch (error: ApolloError | unknown) {
    if (error instanceof ApolloError) {
      return {
        error: error.message,
      };
    }
  }
};

export const register = async (
  email: string,
  password: string,
  lastname: string,
  firstname: string
) => {
  const client = getClient();
  const requestCookies = cookies();
  try {
    const { data, errors } = await client.mutate({
      mutation: SIGNIN,
      variables: { email, password, lastname, firstname },
    });
    if (errors) {
      return {
        error: errors[0].message,
      };
    }
    if (data) {
      requestCookies.set("token_graphql", data.signIn.token);
      return {
        error: null,
      };
    }
  } catch (error: ApolloError | unknown) {
    if (error instanceof ApolloError) {
      return {
        error: error.message,
      };
    } else if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
  }
};
