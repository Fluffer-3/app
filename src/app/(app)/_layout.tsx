import { Redirect, Stack, Tabs } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

export default function AuthGuard() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/log-in" />;
    }

    return (
        <Tabs initialRouteName="posts" screenOptions={{ header: () => <></> }}>
            <Tabs.Screen name="posts" />
            <Tabs.Screen name="servers" />
        </Tabs>
    );
}
