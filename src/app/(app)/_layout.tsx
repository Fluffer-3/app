import { Redirect, Tabs } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

export default function AuthGuard() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) return <Redirect href="/login" />;

    return (
        <Tabs screenOptions={{ header: () => <></> }}>
            <Tabs.Screen name="posts" />
            <Tabs.Screen name="servers" />
        </Tabs>
    );
}
