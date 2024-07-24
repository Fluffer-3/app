import { gql } from "@apollo/client";

export const PulseCheck = gql`
    query apiStatus {
        apiStatus
    }
`;
