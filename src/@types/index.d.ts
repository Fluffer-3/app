declare type LoginCredentials = {
    usernameOrEmail: string;
    password: string;
};

declare type SignupCredentials = {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
};

declare type LoginErrors = {
    notFound?: string | null;
    username?: string | null;
    email?: string | null;
    password?: string | null;
};

declare type SignupErrors = {
    email?: string | null;
    password?: string | null;
    username?: string | null;
    confirmPassword?: string | null;
};

declare type AuthContextType = {
    user?: any | null;
    isLoggedIn: boolean;
    login: (userData: any) => void;
    logout: () => void;
};
