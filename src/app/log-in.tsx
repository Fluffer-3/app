import { useEffect, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import { LoginUser } from "@/gql/auth";
import { useAuth } from "@/providers/AuthProvider";

export default function SignInScreen() {
    const router = useRouter();

    const { isLoggedIn, login } = useAuth();

    useEffect(() => {
        if (isLoggedIn) router.push("/");
    }, [isLoggedIn]);

    const [creds, setCreds] = useState<LoginCredentials>({
        usernameOrEmail: "",
        password: ""
    });

    const [errors, setErrors] = useState<LoginErrors>({
        notFound: null,
        username: null,
        email: null,
        password: null
    });

    const [loginUser] = useMutation(LoginUser, {
        update: (_, { data: { loginUser: userData } = {} }) => {
            setErrors({
                notFound: null,
                email: null,
                password: null,
                username: null
            });

            login(userData);

            router.push("/");
        },
        onError: (error) => {
            // TODO: Come up with a better way to handle errors.
            const { message } = error;
            if (message.toLowerCase().includes("email")) {
                setErrors({
                    notFound: null,
                    email: message,
                    username: null,
                    password: null
                });
            }

            if (message.toLowerCase().includes("username")) {
                setErrors({
                    notFound: null,
                    email: null,
                    username: message,
                    password: null
                });
            }

            if (message.toLowerCase().includes("password")) {
                setErrors({
                    notFound: null,
                    username: null,
                    email: null,
                    password: message
                });
            }

            if (message.toLowerCase().includes("not found")) {
                setErrors({
                    notFound: message,
                    email: null,
                    username: null,
                    password: null
                });
            }
        },
        variables: creds
    });

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 justify-center items-center gap-5 p-6"
        >
            <Card className="w-full max-w-sm p-10 rounded-2xl bg-secondary/20">
                <CardContent>
                    <View className="flex-col gap-3 items-center justify-center">
                        <Text className="text-center">
                            Sign in to{" "}
                            <Text className="font-bold">Fluffer</Text>
                        </Text>
                        {errors?.notFound && (
                            <Text className="text-red-500 text-sm">
                                {errors.notFound}
                            </Text>
                        )}
                        <View className="w-full">
                            <Text>Username/Email</Text>
                            <Input
                                className="input-field"
                                value={creds.usernameOrEmail}
                                onChangeText={(text) =>
                                    setCreds({
                                        ...creds,
                                        usernameOrEmail: text
                                    })
                                }
                                placeholder="Username or Email"
                                autoCapitalize="none"
                                inputMode="email"
                            />
                            {errors?.email && (
                                <Text className="text-red-500 text-sm">
                                    {errors.email}
                                </Text>
                            )}
                            {errors?.username && (
                                <Text className="text-red-500 text-sm">
                                    {errors.username}
                                </Text>
                            )}
                        </View>
                        <View className="w-full">
                            <Text>Password</Text>
                            <Input
                                className="input-field"
                                value={creds.password}
                                onChangeText={(text) =>
                                    setCreds({ ...creds, password: text })
                                }
                                placeholder="Password"
                                autoCapitalize="none"
                                secureTextEntry
                            />
                            {errors?.password && (
                                <Text className="text-red-500 text-sm">
                                    {errors.password}
                                </Text>
                            )}
                        </View>
                    </View>
                </CardContent>
                <CardFooter className="flex-col gap-3 pb-0">
                    <Button onPress={() => loginUser()}>
                        <Text>Submit</Text>
                    </Button>
                    <Text className="text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <Text
                            className="text-primary"
                            onPress={() => router.push("/sign-up")}
                        >
                            Sign up
                        </Text>
                    </Text>
                </CardFooter>
            </Card>
        </KeyboardAvoidingView>
    );
}
