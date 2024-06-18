import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    InMemoryCache
} from "@apollo/client";

import * as SecureStore from "expo-secure-store";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { Platform } from "react-native";

const httpLink = createHttpLink({
    uri: process.env.EXPO_PUBLIC_API_URL
});

const authLink = setContext((_, { headers }) => {
    let token = null;
    if (Platform.OS === "web") {
        token = localStorage.getItem("ff-token");
    } else {
        token = SecureStore.getItem("ff-token");
    }

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (process.env.NODE_ENV !== "development") return;
    console.log(networkError);
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, source }) => {
            console.log(
                `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}, Source: ${source}`
            );
        });
    }
    if (networkError) console.log(`[Network Error]: ${networkError.stack}`);
});

const retryLink = new RetryLink({
    delay: {
        initial: 300,
        max: Infinity,
        jitter: true
    },
    attempts: {
        max: 5,
        retryIf: (error) => !!error
    }
});

const link = ApolloLink.from([retryLink, errorLink, authLink, httpLink]);
export const cache = new InMemoryCache({
    addTypename: false
});

const client = new ApolloClient({
    link,
    cache,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network"
        }
    }
});

export default client;
