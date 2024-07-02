import { gql } from "@apollo/client";

export const LoginUser = gql`
    mutation loginUser($usernameOrEmail: String!, $password: String!) {
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
    mutation signupUser(
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
