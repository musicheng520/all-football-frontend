import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function MatchCard({ match }) {
    return (
        <Link to={`/matches/${match.id}`} style={{ textDecoration: "none" }}>
            <Box
                sx={{
                    p: 2,
                    borderRadius: "16px",
                    background: "#fff",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    "&:hover": { transform: "translateY(-4px)" }
                }}
            >
                <Typography fontWeight={600}>
                    {match.homeTeamName} {match.homeScore ?? "-"} :
                    {match.awayScore ?? "-"} {match.awayTeamName}
                </Typography>
                <Typography fontSize={12} color="gray">
                    {match.status}
                </Typography>
            </Box>
        </Link>
    );
}