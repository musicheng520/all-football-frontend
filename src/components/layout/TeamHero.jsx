
import { Box, Avatar, Typography, Button } from "@mui/material";

export default function TeamHero({ team, following }) {
    return (
        <Box
            sx={{
                borderRadius: "28px",
                p: 4,
                mb: 4,
                background: "linear-gradient(135deg, #BFF332 0%, #9DD500 100%)",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 3
            }}
        >
            <Avatar src={team.logo} sx={{ width: 80, height: 80 }} />

            <Box>
                <Typography variant="h5" fontWeight={700}>
                    {team.name}
                </Typography>
                <Typography>{team.country}</Typography>
            </Box>

            <Button
                sx={{
                    ml: "auto",
                    borderRadius: "999px",
                    px: 3,
                    background: "#111",
                    color: "#fff",
                    "&:hover": { background: "#222" }
                }}
            >
                {following ? "Following" : "Follow"}
            </Button>
        </Box>
    );
}