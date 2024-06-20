import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    createHttpLink,
    InMemoryCache
} from "@apollo/client";

import * as SecureStore from "expo-secure-store";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { PropsWithChildren, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache } from "apollo3-cache-persist";
import { SplashScreen } from "expo-router";
import { Platform } from "react-native";
import { PortalHost } from "@/components/primitives/portal";
import { store, persistor } from "@/reducers";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./AuthProvider";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { StatusBar } from "expo-status-bar";

const httpLink = createHttpLink({
    uri: process.env.EXPO_PUBLIC_API_URL
});

const authLink = setContext((_, { headers }) => {
    const token = SecureStore.getItem("ff-token");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (process.env.NODE_ENV !== "development") return;
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
const cache = new InMemoryCache({
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

const LIGHT_THEME: Theme = {
    dark: false,
    colors: NAV_THEME.light
};
const DARK_THEME: Theme = {
    dark: true,
    colors: NAV_THEME.dark
};

SplashScreen.preventAutoHideAsync();

export default function MainProvider(props: PropsWithChildren) {
    const [loadingCache, setLoadingCache] = useState(true);
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            const theme = await AsyncStorage.getItem("theme");
            if (Platform.OS === "web") {
                // Adds the background color to the html element to prevent white background on overscroll.
                document.documentElement.classList.add("bg-background");
            }
            if (!theme) {
                AsyncStorage.setItem("theme", colorScheme);
                setIsColorSchemeLoaded(true);
                return;
            }
            const colorTheme = theme === "dark" ? "dark" : "light";
            if (colorTheme !== colorScheme) {
                setColorScheme(colorTheme);

                setIsColorSchemeLoaded(true);
                return;
            }
            setIsColorSchemeLoaded(true);
        })().finally(() => {
            SplashScreen.hideAsync();
        });

        let storage = null;
        if (Platform.OS === "web") {
            storage = localStorage;
        } else {
            storage = AsyncStorage;
        }

        persistCache({
            cache,
            storage
        }).then(() => setLoadingCache(false));
    }, [colorScheme, setColorScheme]);

    if (!isColorSchemeLoaded) {
        return null;
    }

    if (loadingCache) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ApolloProvider client={client}>
                    <AuthProvider>
                        <ThemeProvider
                            value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
                        >
                            <StatusBar
                                style={isDarkColorScheme ? "light" : "dark"}
                            />
                            {props.children}
                            <PortalHost />
                        </ThemeProvider>
                    </AuthProvider>
                </ApolloProvider>
            </PersistGate>
        </Provider>
    );
}
