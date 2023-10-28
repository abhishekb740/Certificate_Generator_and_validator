import { Container, Typography } from "@mui/material";

export default function IssueCertificatePage() {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}
        >
            <Typography component="div" variant="h4">Create your own certificate</Typography>
        </Container>
    )
}