import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { SignupUser } from "@/gql/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

export default function SignUpScreen() {
    const router = useRouter();

    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) router.push("/");
    }, [isLoggedIn]);

    const [creds, setCreds] = useState<SignupCredentials>({
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<SignupErrors>({
        email: null,
        username: null,
        password: null,
        confirmPassword: null
    });

    const [successful, setSuccessful] = useState(false);

    const [signupUser] = useMutation(SignupUser, {
        update: () => {
            setErrors({
                email: null,
                username: null,
                password: null,
                confirmPassword: null
            });

            setSuccessful(true);
        },
        onError: (error) => {
            // TODO: Come up with a better way to handle errors.
            const { message } = error;
            if (message.toLowerCase().includes("email")) {
                setErrors({
                    email: message,
                    username: null,
                    password: null,
                    confirmPassword: null
                });
            }

            if (message.toLowerCase().includes("username")) {
                setErrors({
                    email: null,
                    username: message,
                    password: null,
                    confirmPassword: null
                });
            }

            if (message.toLowerCase().includes("password")) {
                setErrors({
                    email: null,
                    username: null,
                    password: message,
                    confirmPassword: null
                });
            }

            if (message.toLowerCase().includes("confirm")) {
                setErrors({
                    email: null,
                    username: null,
                    password: null,
                    confirmPassword: message
                });
            }
        },
        variables: creds
    });

    if (successful)
        return (
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30"
            >
                <Card className="w-full max-w-sm p-6 rounded-2xl">
                    <CardContent>
                        <View className="flex-col gap-3 items-center justify-center">
                            <Text className="text-center">
                                Signed up for{" "}
                                <Text className="font-bold">Fluffer</Text>
                            </Text>
                            <Text className="text-green-500 text-center">
                                Account created successfully
                            </Text>
                        </View>
                    </CardContent>
                    <CardFooter className="flex-col gap-3 pb-0">
                        <Button onPress={() => router.push("/")}>
                            <Text>Sign in</Text>
                        </Button>
                    </CardFooter>
                </Card>
            </KeyboardAvoidingView>
        );

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30"
        >
            <Card className="w-full max-w-sm p-6 rounded-2xl">
                <CardContent>
                    <View className="flex-col gap-3 items-center justify-center">
                        <Text className="text-center">
                            Sign up for{" "}
                            <Text className="font-bold">Fluffer</Text>
                        </Text>
                        <View className="w-full">
                            <Text>Email</Text>
                            <Input
                                className="input-field"
                                placeholder="Email"
                                value={creds.email}
                                onChangeText={(text) =>
                                    setCreds({ ...creds, email: text })
                                }
                                autoCapitalize="none"
                                inputMode="email"
                            />
                            {errors?.email && (
                                <Text className="text-red-500 text-sm">
                                    {errors.email}
                                </Text>
                            )}
                        </View>
                        <View className="w-full">
                            <Text>Username</Text>
                            <Input
                                className="input-field"
                                placeholder="Username"
                                value={creds.username}
                                onChangeText={(text) =>
                                    setCreds({ ...creds, username: text })
                                }
                                autoCapitalize="none"
                            />
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
                                placeholder="Password"
                                onChangeText={(text) =>
                                    setCreds({ ...creds, password: text })
                                }
                                value={creds.password}
                                autoCapitalize="none"
                                secureTextEntry
                            />
                            {errors?.password && (
                                <Text className="text-red-500 text-sm">
                                    {errors.password}
                                </Text>
                            )}
                        </View>
                        <View className="w-full">
                            <Text>Confirm Password</Text>
                            <Input
                                className="input-field"
                                placeholder="Confirm Password"
                                onChangeText={(text) =>
                                    setCreds({
                                        ...creds,
                                        confirmPassword: text
                                    })
                                }
                                autoCapitalize="none"
                                value={creds.confirmPassword}
                                secureTextEntry
                            />
                            {errors?.confirmPassword && (
                                <Text className="text-red-500 text-sm">
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </View>
                    </View>
                </CardContent>
                <CardFooter className="flex-col gap-3 pb-0">
                    <Button onPress={() => signupUser()}>
                        <Text>Submit</Text>
                    </Button>
                    <Text className="text-center text-muted-foreground">
                        Already have an account?{" "}
                        <Text
                            className="text-primary"
                            onPress={() => router.push("/")}
                        >
                            Sign in
                        </Text>
                    </Text>
                </CardFooter>
            </Card>
        </KeyboardAvoidingView>
    );
}
