import { gql } from "@apollo/client";

export const PulseCheck = gql`
    query PulseCheck {
        pulse
    }
`;
