import { Box } from "@mui/material";

export default function SectionCard({ children, sx }) {
    return (
        <Box
            sx={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                p: 3,
                ...sx
            }}
        >
            {children}
        </Box>
    );
}