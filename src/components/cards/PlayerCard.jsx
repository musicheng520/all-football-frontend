import { Box, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function PlayerCard({ player, season }) {
    return (
        <Link to={`/players/${player.id}?season=${season}`} style={{ textDecoration: "none" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "16px",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "&:hover": { transform: "translateY(-3px)" }
                }}
            >
                <Avatar src={player.photo} />
                <Typography fontWeight={500}>
                    {player.name} ({player.age})
                </Typography>
            </Box>
        </Link>
    );
}