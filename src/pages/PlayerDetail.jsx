import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

import {
    Tabs,
    Tab,
    Select,
    MenuItem,
    Box,
    Card,
    CardContent,
    Typography,
    Avatar
} from "@mui/material";

import { motion } from "framer-motion";

import { getPlayerDetail } from "../api/players.js";
import { getNewsByPlayer } from "../api/news";

function PlayerDetail() {

    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const seasonParam = searchParams.get("season") || 2025;

    const [season, setSeason] = useState(Number(seasonParam));

    const [player, setPlayer] = useState(null);
    const [team, setTeam] = useState(null);
    const [statistics, setStatistics] = useState(null);

    const [news, setNews] = useState([]);
    const [tab, setTab] = useState(0);

    // =========================
    // DATA
    // =========================
    useEffect(() => {

        getPlayerDetail(id, season)
            .then(res => {

                const data = res.data.data;

                setPlayer(data.player);
                setTeam(data.team);
                setStatistics(data.statistics?.[0] || null);

            });

    }, [id, season]);

    useEffect(() => {

        getNewsByPlayer(id)
            .then(res => setNews(res.data.data || []));

    }, [id]);

    const handleSeasonChange = (value) => {

        setSeason(value);
        setSearchParams({ season: value });

    };

    if (!player) return <div>Loading...</div>;

    // =========================
    // STAT BAR（你要的动画）
    // =========================
    const StatBar = ({ label, value, max = 20 }) => {

        const percent = Math.min((value / max) * 100, 100);

        return (
            <Box sx={{ mb: 2 }}>
                <Typography fontSize={13} sx={{ mb: 0.5 }}>
                    {label} ({value})
                </Typography>

                <Box sx={{
                    height: 8,
                    borderRadius: 999,
                    background: "#eee",
                    overflow: "hidden"
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8 }}
                        style={{
                            height: "100%",
                            background: "linear-gradient(90deg,#1976d2,#42a5f5)"
                        }}
                    />
                </Box>
            </Box>
        );
    };

    return (

        <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>

            {/* ========================= */}
            {/* HERO */}
            {/* ========================= */}
            <Card sx={{ borderRadius: 4, mb: 3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>

                    <Avatar
                        src={player.photo}
                        sx={{ width: 90, height: 90 }}
                    />

                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            {player.name}
                        </Typography>

                        <Typography color="text.secondary">
                            Age {player.age}
                        </Typography>

                        {team && (
                            <Link
                                to={`/teams/${team.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                    <img src={team.logo} width="20" />
                                    <Typography>{team.name}</Typography>
                                </Box>
                            </Link>
                        )}
                    </Box>

                    {/* season */}
                    <Box sx={{ ml: "auto" }}>
                        <Select
                            size="small"
                            value={season}
                            onChange={(e) => handleSeasonChange(e.target.value)}
                        >
                            {[2025, 2024, 2023, 2022].map(y => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                </CardContent>
            </Card>

            {/* ========================= */}
            {/* TABS */}
            {/* ========================= */}
            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
                <Tab label="Overview" />
                <Tab label="Stats" />
                <Tab label="News" />
            </Tabs>

            {/* ========================= */}
            {/* OVERVIEW */}
            {/* ========================= */}
            {tab === 0 && (

                <Card sx={{ mt: 3, borderRadius: 4 }}>
                    <CardContent>

                        <Typography fontWeight={700} mb={2}>
                            Player Info
                        </Typography>

                        <Typography>Nationality: {player.nationality || "Unknown"}</Typography>
                        <Typography>Height: {player.height || "-"}</Typography>
                        <Typography>Weight: {player.weight || "-"}</Typography>

                    </CardContent>
                </Card>

            )}

            {/* ========================= */}
            {/* STATS（核心） */}
            {/* ========================= */}
            {tab === 1 && (

                <Card sx={{ mt: 3, borderRadius: 4 }}>
                    <CardContent>

                        <Typography fontWeight={700} mb={2}>
                            Season Performance
                        </Typography>

                        {!statistics && <Typography>No data</Typography>}

                        {statistics && (
                            <>
                                <StatBar label="Goals" value={statistics.goals} max={15} />
                                <StatBar label="Assists" value={statistics.assists} max={15} />
                                <StatBar label="Appearances" value={statistics.appearances} max={38} />

                                <StatBar label="Rating" value={parseFloat(statistics.rating)} max={10} />
                            </>
                        )}

                    </CardContent>
                </Card>

            )}

            {/* ========================= */}
            {/* NEWS */}
            {/* ========================= */}
            {tab === 2 && (

                <Box sx={{ mt: 3, display: "grid", gap: 2 }}>

                    {news.length === 0 && <Typography>No news</Typography>}

                    {news.map(n => (

                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>

                                    <Link to={`/news/${n.id}`} style={{ textDecoration: "none" }}>
                                        <Typography fontWeight={600}>
                                            {n.title}
                                        </Typography>
                                    </Link>

                                    <Typography fontSize={12} color="text.secondary">
                                        {n.createdAt?.slice(0, 10)}
                                    </Typography>

                                </CardContent>
                            </Card>
                        </motion.div>

                    ))}

                </Box>

            )}

        </Box>
    );
}

export default PlayerDetail;