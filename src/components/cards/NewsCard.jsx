import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const DEFAULT_IMG = "https://via.placeholder.com/400x200?text=No+Image";

export default function NewsCard({ item }) {

    if (!item) return null;

    return (
        <Box
            component={Link}
            to={`/news/${item.id}`}
            sx={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 4,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "0.25s",
                "&:hover": {
                    transform: "translateY(-4px)"
                }
            }}
        >
            <img
                src={item.coverImage || DEFAULT_IMG}
                style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover"
                }}
            />

            <Box sx={{ p: 1.5 }}>
                <Typography fontWeight={700} fontSize={14}>
                    {item.title}
                </Typography>
            </Box>
        </Box>
    );
}