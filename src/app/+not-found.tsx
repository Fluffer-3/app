import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
    return (
        <View className="flex-1 justify-center items-center gap-5">
            <Text className="text-4xl font-bold">🤔 Oops</Text>
            <Text className="text-xl">How did we end up here?</Text>
            <Link href="/">
                <Text className="text-lg font-bold">Go back</Text>
            </Link>
        </View>
    );
}
