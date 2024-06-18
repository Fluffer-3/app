import "@/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { PortalHost } from "@/components/primitives/portal";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { persistCache } from "apollo3-cache-persist";

import APIProvider, { cache } from "@/providers/APIProvider";
import { useApolloClientDevTools } from "@dev-plugins/apollo-client";
import { AuthProvider } from "@/providers/AuthProvider";

const LIGHT_THEME: Theme = {
    dark: false,
    colors: NAV_THEME.light
};
const DARK_THEME: Theme = {
    dark: true,
    colors: NAV_THEME.dark
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useApolloClientDevTools(APIProvider);

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
        <ApolloProvider client={APIProvider}>
            <AuthProvider>
                <ThemeProvider
                    value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
                >
                    <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
                    <Stack
                        initialRouteName="log-in"
                        screenOptions={{
                            headerBackVisible: false,
                            title: "",
                            headerRight: () => <ThemeToggle />
                        }}
                    >
                        <Stack.Screen name="log-in" />
                        <Stack.Screen name="sign-up" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <PortalHost />
                </ThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}

/**!SECTION
 *
 */
