import "@/global.css";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { Stack } from "expo-router";
import ThemeToggle from "@/components/ThemeToggle";
import { PulseCheck } from "@/gql/general";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export default function RootLayout() {
    const [pulse, setPulse] = useState(false);

    const { data: { pulse: pulseData } = {} } = useQuery(PulseCheck, {
        pollInterval: pulse ? 0 : 1000,
        fetchPolicy: "no-cache"
    });

    useEffect(() => {
        if (pulseData) setPulse(true);
    }, [pulseData]);

    return (
        <Stack
            initialRouteName={pulse ? "log-in" : "server-offline"}
            screenOptions={{
                headerBackVisible: false,
                title: "",
                headerRight: () => <ThemeToggle />
            }}
        >
            <Stack.Screen name="server-offline" />
            <Stack.Screen name="log-in" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

/**!SECTION
 *
 */
