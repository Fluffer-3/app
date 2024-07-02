import { Stack, usePathname } from "expo-router";
import ThemeToggle from "@/components/ThemeToggle";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export default function RootLayout() {
    console.log("RootLayout", { pathname: usePathname() });
    return (
        <Stack
            screenOptions={{
                title: "",
                headerBackVisible: false,
                headerLeft: () => <ThemeToggle />
            }}
        />
    );
}
