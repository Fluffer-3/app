import { PropsWithChildren, createContext, useContext } from "react";
import { useStorageState } from "@/lib/useStorageState";

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    login: (userData: any) => userData,
    logout: () => {}
});

export function useAuth() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useAuth must be used within an AuthProvider");

    return value;
}

export function AuthProvider(props: PropsWithChildren) {
    const [[_, user], setUser] = useStorageState("user");

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: (userData: any) => setUser(userData),
                logout: () => setUser(null)
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
