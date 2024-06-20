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
    user?: User | null;
    isLoggedIn: boolean;
    login: (userData: any) => void;
    logout: () => void;
};

declare type User = {
    id: string;
    username: string;
    email: string;
    avatar?: string | null;
    nickname?: string | null;
    bio?: string | null;
    createdAt;
    createdTimestamp;
    updatedAt;
    updatedTimestamp;
};

declare type UserWithToken = User & {
    token: string;
};
