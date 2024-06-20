import { View } from "react-native";
import { Text } from "./ui/text";

const ErrorMessage = ({
    message,
    subtext
}: {
    message: string;
    subtext?: string | string[];
}) => {
    return (
        <View className="flex container h-screen m-auto">
            <View className="flex flex-col justify-center m-auto items-center">
                <Text className="text-2xl font-bold">{message}</Text>
                {subtext &&
                    (Array.isArray(subtext) ? (
                        subtext.map((text, i) => <Text key={i}>{text}</Text>)
                    ) : (
                        <Text>{subtext}</Text>
                    ))}
            </View>
        </View>
    );
};

export default ErrorMessage;
