import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomeMatchCard({ match }) {
    const isNested = !!match.fixture;
    const matchId = isNested ? match.fixture?.id : match.id;

    const home = isNested
        ? match.teams?.home
        : { name: match.homeTeamName, logo: match.homeTeamLogo };

    const away = isNested
        ? match.teams?.away
        : { name: match.awayTeamName, logo: match.awayTeamLogo };

    const homeScore = isNested
        ? match.goals?.home
        : match.homeScore;

    const awayScore = isNested
        ? match.goals?.away
        : match.awayScore;

    const status = isNested
        ? match.fixture?.status?.short
        : match.status;

    const isLive = ["LIVE", "1H", "2H", "HT"].includes(status);

    return (
        <Link
            to={`/matches/${matchId}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "#fff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    borderLeft: isLive
                        ? "4px solid #ff3b30"
                        : "4px solid transparent",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
                    }
                }}
            >
                <Team side="left" team={home} />
                <Score
                    home={homeScore}
                    away={awayScore}
                    status={status}
                    isLive={isLive}
                />
                <Team side="right" team={away} />
            </Box>
        </Link>
    );
}

function Team({ team, side }) {
    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent:
                    side === "right" ? "flex-end" : "flex-start"
            }}
        >
            {side === "left" && (
                <img
                    src={team?.logo}
                    style={{ width: 24, height: 24 }}
                />
            )}

            <Typography
                fontWeight={600}
                fontSize={14}
                noWrap
            >
                {team?.name}
            </Typography>

            {side === "right" && (
                <img
                    src={team?.logo}
                    style={{ width: 24, height: 24 }}
                />
            )}
        </Box>
    );
}

function Score({ home, away, status, isLive }) {
    return (
        <Box
            sx={{
                width: 80,
                textAlign: "center",
                flexShrink: 0
            }}
        >
            <Typography fontWeight={800} fontSize={16}>
                {home ?? "-"} : {away ?? "-"}
            </Typography>

            <Typography
                fontSize={12}
                sx={{
                    color: isLive ? "#ff3b30" : "#666",
                    fontWeight: isLive ? 700 : 400
                }}
            >
                {status || "NS"}
            </Typography>
        </Box>
    );
}