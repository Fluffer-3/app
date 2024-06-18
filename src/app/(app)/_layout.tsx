import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

export default function AuthGuard() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/log-in" />;
    }

    return (
        <Stack initialRouteName="index" screenOptions={{ header: () => <></> }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
