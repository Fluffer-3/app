import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { useAuth } from "./AuthProvider";

export const AppModeContext = createContext<AppModeContextType>({
    appMode: "servers",
    setAppMode: (_appMode: "servers" | "posts") => void 0,
    changeAppMode: (_appMode: "servers" | "posts") => void 0
});

export function AppModeProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn } = useAuth();
    const [appMode, setAppMode] = useState<"servers" | "posts">("servers");

    useEffect(() => {
        console.log("AppModeProvider", { isLoggedIn, pathname, appMode });
        if (
            !isLoggedIn &&
            (pathname.includes("servers") || pathname.includes("posts"))
        )
            router.push("/login");

        if (isLoggedIn && (pathname === "/login" || pathname === "/sign-up"))
            router.push(appMode);

        if (!isLoggedIn && pathname === "/") router.push("/login");
        if (isLoggedIn && pathname === "/") router.push(appMode);
        if (pathname.includes("servers")) setAppMode("servers");
        if (pathname.includes("posts")) setAppMode("posts");
    }, [isLoggedIn, pathname, appMode]);

    const changeAppMode = (appMode: "servers" | "posts") => {
        setAppMode(appMode);
        router.push(appMode);
    };

    return (
        <AppModeContext.Provider value={{ appMode, setAppMode, changeAppMode }}>
            {children}
        </AppModeContext.Provider>
    );
}
