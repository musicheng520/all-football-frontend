import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NewsCard({ item }) {
    return (
        <Link to={`/news/${item.id}`} style={{ textDecoration: "none" }}>
            <Box
                sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                    transition: "0.25s",
                    "&:hover": { transform: "translateY(-6px)" }
                }}
            >
                <Box sx={{ height: 140, background: "#eee" }}>
                    <img
                        src={item.cover}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </Box>

                <Box p={2}>
                    <Typography fontWeight={600} fontSize={14}>
                        {item.title}
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
}