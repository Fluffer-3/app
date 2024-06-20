import ErrorMessage from "@/components/ErrorMessage";

export default function ServerOffline() {
    return (
        <ErrorMessage
            message="😢 Server is down 😢"
            subtext={[
                "Please try again later.",
                "We apologize for the inconvenience.",
                "You can also contact developers for more information."
            ]}
        />
    );
}
