import { useAuth } from "@/providers/AuthProvider";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Index() {
    const { logout } = useAuth();
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text
                onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    logout();
                }}
            >
                Sign Out
            </Text>
        </View>
    );
}
