import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function TeamCard({ team }) {

    return (
        <Card
            component={Link}
            to={`/teams/${team.id}`}
            sx={{
                textDecoration: "none",
                borderRadius: 3,
                height: "100%",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.15)"
                }
            }}
        >
            <CardContent
                sx={{
                    textAlign: "center",
                    width: "100%"
                }}
            >

                {/* 🟢 LOGO（关键修复） */}
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <img
                        src={team.logo}
                        alt={team.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"   // ⭐关键
                        }}
                    />
                </Box>

                {/* NAME */}
                <Typography fontWeight={600}>
                    {team.name}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                    {team.country}
                </Typography>

            </CardContent>
        </Card>
    );
}

export default TeamCard;