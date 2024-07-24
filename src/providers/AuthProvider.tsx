import { PropsWithChildren, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/reducers/auth";

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    login: (userData: User) => userData,
    logout: () => {}
});

export function useAuth() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV === "development" && value === undefined)
        throw new Error("useAuth must be used within an AuthProvider");

    return value;
}

export function AuthProvider(props: PropsWithChildren) {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    const loginUser = (userData: UserWithToken) => {
        const { token, ...user } = userData;
        dispatch(login(user));
    };

    const logoutUser = () => {
        SecureStore.deleteItemAsync("ff-token");
        dispatch(logout());
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login: loginUser,
                logout: logoutUser
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
