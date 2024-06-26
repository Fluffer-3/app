import { Stack } from "expo-router";
import ThemeToggle from "@/components/ThemeToggle";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export default function RootLayout() {
    return (
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
    );
}
