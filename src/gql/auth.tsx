import { gql } from "@apollo/client";

export const LoginUser = gql`
    mutation LoginUser($usernameOrEmail: String!, $password: String!) {
        loginUser(
            input: { usernameOrEmail: $usernameOrEmail, password: $password }
        ) {
            token
            id
            username
            email
            avatar
            nickname
            bio
            createdAt
            createdTimestamp
            updatedAt
            updatedTimestamp
        }
    }
`;

export const SignupUser = gql`
    mutation SignupUser(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        signupUser(
            input: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        )
    }
`;
