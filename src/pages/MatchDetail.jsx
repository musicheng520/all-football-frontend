import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {
    Tabs,
    Tab,
    Box,
    Chip,
    Typography,
    Card,
    CardContent,
    Stack
} from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsIcon from "@mui/icons-material/Sports";
import PercentIcon from "@mui/icons-material/Percent";
import FlagIcon from "@mui/icons-material/Flag";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { getFixtureDetail } from "../api/fixtures";
import { connectSocket, disconnectSocket } from "../utils/socket";

function MatchDetail() {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [scoreFlash, setScoreFlash] = useState(false);
    const [statsAnimateKey, setStatsAnimateKey] = useState(0);

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        if (!id || id === "null") return;

        setLoading(true);

        getFixtureDetail(id)
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    // =========================
    // LIVE SOCKET
    // =========================
    useEffect(() => {
        if (!id || id === "null") return;

        const WS_URL =
            window.location.hostname === "localhost"
                ? "http://localhost:8080/ws"
                : "https://api.sicheng55.com/ws";

        console.log("WS_URL =", WS_URL);

        const socket = new SockJS(WS_URL);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {

                // 正确订阅（核心）
                client.subscribe(`/topic/match/${id}`, (msg) => {

                    const wsData = JSON.parse(msg.body);

                    setData(prev => {
                        if (!prev) return prev;

                        const oldScore = `${prev.fixture?.homeScore ?? 0}-${prev.fixture?.awayScore ?? 0}`;
                        const newScore = `${wsData.goals?.home ?? 0}-${wsData.goals?.away ?? 0}`;

                        if (oldScore !== newScore) {
                            setScoreFlash(true);
                            setTimeout(() => setScoreFlash(false), 650);
                        }

                        if (wsData.statistics) {
                            setStatsAnimateKey(k => k + 1);
                        }

                        return {
                            ...prev,
                            fixture: {
                                ...prev.fixture,
                                homeScore: wsData.goals?.home ?? prev.fixture.homeScore,
                                awayScore: wsData.goals?.away ?? prev.fixture.awayScore,
                                status: wsData.fixture?.status?.short ?? prev.fixture.status,
                            },
                            events: wsData.events || prev.events,
                            statistics: wsData.statistics || prev.statistics
                        };
                    });

                });
            }
        });

        client.activate();

        return () => client.deactivate();

    }, [id]);

    // =========================
    // HELPERS
    // =========================
    const formatTime = (t) => {
        if (!t || !Array.isArray(t) || t.length < 5) return "TBD";
        return `${t[0]}-${t[1]}-${t[2]} ${String(t[3]).padStart(2, "0")}:${String(t[4]).padStart(2, "0")}`;
    };

    const isLive = (status) => {
        return ["LIVE", "1H", "2H", "HT", "ET", "P", "BT"].includes(status);
    };

    const getStatusChip = (status) => {
        if (isLive(status)) {
            return (
                <Chip
                    label="LIVE"
                    color="error"
                    size="small"
                    sx={{
                        fontWeight: 700,
                        animation: "livePulse 1.6s infinite"
                    }}
                />
            );
        }

        if (status === "FT") {
            return <Chip label="FT" color="success" size="small" sx={{ fontWeight: 700 }} />;
        }

        if (status === "NS") {
            return <Chip label="UPCOMING" size="small" />;
        }

        return <Chip label={status} size="small" />;
    };

    const deduplicateEvents = (events = []) => {
        const seen = new Set();

        return events.filter(e => {
            const key = `${e.minute}-${e.playerId}-${e.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    const statMeta = useMemo(() => ({
        shotsTotal: { label: "Shots", icon: <SportsSoccerIcon fontSize="small" /> },
        shotsOnTarget: { label: "On Target", icon: <SportsIcon fontSize="small" /> },
        possession: { label: "Possession", icon: <PercentIcon fontSize="small" /> },
        fouls: { label: "Fouls", icon: <WarningIcon fontSize="small" /> },
        corners: { label: "Corners", icon: <FlagIcon fontSize="small" /> },
        yellowCards: { label: "Cards", icon: <AccessTimeIcon fontSize="small" /> },
        offsides: { label: "Offsides", icon: <AccessTimeIcon fontSize="small" /> }
    }), []);

    // =========================
    // EVENTS
    // =========================
    const renderEvents = (events, homeId) => {
        if (!events || events.length === 0) {
            return (
                <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <CardContent>
                        <Typography color="text.secondary">No events yet</Typography>
                    </CardContent>
                </Card>
            );
        }

        return deduplicateEvents(events)
            .sort((a, b) => a.minute - b.minute)
            .map((e, i) => {
                const isHome = e.teamId === homeId;

                return (
                    <Box
                        key={`${e.minute}-${e.playerId}-${e.type}-${i}`}
                        sx={{
                            display: "flex",
                            justifyContent: isHome ? "flex-start" : "flex-end",
                            mb: 2
                        }}
                    >
                        <Card
                            sx={{
                                maxWidth: "65%",
                                borderRadius: 3,
                                background: "#f9fafb",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
                            }}
                        >
                            <CardContent>
                                <Typography fontWeight={700}>
                                    {e.minute}' {e.type}
                                </Typography>

                                <Typography fontSize={14}>
                                    {e.playerName}
                                </Typography>

                                {e.assistPlayerName && (
                                    <Typography fontSize={12} color="text.secondary">
                                        Assist: {e.assistPlayerName}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                );
            });
    };

    // =========================
    // STATS
    // =========================
    const renderStats = (stats) => {
        if (!stats || !stats.home || !stats.away) {
            return (
                <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <CardContent>
                        <Typography color="text.secondary">No statistics available</Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Box sx={{ mt: 2 }}>
                {Object.keys(statMeta).map((key, index) => {
                    const meta = statMeta[key];
                    const homeVal = stats.home[key] || 0;
                    const awayVal = stats.away[key] || 0;
                    const total = homeVal + awayVal || 1;
                    const percent = (homeVal / total) * 100;

                    return (
                        <Box key={`${key}-${statsAnimateKey}`} sx={{ mb: 4 }}>
                            {/* Title */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1.2,
                                    color: "#1976d2"
                                }}
                            >
                                {meta.icon}
                                <Typography fontWeight={700}>
                                    {meta.label}
                                </Typography>
                            </Box>

                            {/* Values + Bar */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Typography width={48} fontWeight={500}>
                                    {homeVal}
                                </Typography>

                                <Box
                                    sx={{
                                        flex: 1,
                                        mx: 2,
                                        height: 8,
                                        borderRadius: 999,
                                        background: "#e9ecef",
                                        overflow: "hidden",
                                        position: "relative"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            "--target-width": `${percent}%`,
                                            width: "var(--target-width)",
                                            height: "100%",
                                            borderRadius: 999,
                                            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                                            animation: `statsGrow 0.9s ease ${index * 0.08}s both`,
                                            transition: "width 0.7s ease-in-out"
                                        }}
                                    />
                                </Box>

                                <Typography width={48} textAlign="right" fontWeight={500}>
                                    {awayVal}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    // =========================
    // LINEUP
    // =========================
    const renderLineup = (lineup, teamName, status) => {
        if (!lineup) {
            return (
                <Card sx={{ borderRadius: 4, mb: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <CardContent>
                        <Typography>{teamName}: No lineup</Typography>
                    </CardContent>
                </Card>
            );
        }

        if (!lineup.startingXI?.length) {
            let text = `${teamName}: No data`;

            if (status === "NS") text = `${teamName}: Not started`;
            if (isLive(status)) text = `${teamName}: Loading lineup...`;

            return (
                <Card sx={{ borderRadius: 4, mb: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                    <CardContent>
                        <Typography>{text}</Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card sx={{ borderRadius: 4, mb: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                        {teamName} ({lineup.formation})
                    </Typography>

                    <Typography fontSize={14} color="text.secondary">
                        Coach: {lineup.coach}
                    </Typography>

                    <Typography mt={2} mb={1} fontWeight={600}>
                        Starting XI
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {lineup.startingXI.map(p => (
                            <Chip key={p.playerId} label={p.playerName} />
                        ))}
                    </Stack>

                    <Typography mt={2.5} mb={1} fontWeight={600}>
                        Substitutes
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {lineup.substitutes.map(p => (
                            <Chip key={p.playerId} label={p.playerName} variant="outlined" />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    // =========================
    // STATE
    // =========================
    if (loading) return <Typography>Loading...</Typography>;
    if (!data) return <Typography>No data</Typography>;

    const { fixture, homeTeam, awayTeam, events, statistics } = data;

    return (
        <>
            <style>
                {`
                @keyframes statsGrow {
                    from {
                        width: 0;
                        opacity: 0.7;
                    }
                    to {
                        width: var(--target-width);
                        opacity: 1;
                    }
                }

                @keyframes livePulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.45);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(211, 47, 47, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(211, 47, 47, 0);
                    }
                }
                `}
            </style>

            <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
                {/* HEADER */}
                <Card
                    sx={{
                        borderRadius: 4,
                        mb: 3,
                        boxShadow: "0 10px 28px rgba(0,0,0,0.07)"
                    }}
                >
                    <CardContent sx={{ py: 3.5 }}>
                        <Typography textAlign="center" fontWeight={700}>
                            {fixture.round}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2
                            }}
                        >
                            {/* HOME */}
                            <Box textAlign="center" sx={{ width: 180 }}>
                                <Box
                                    component="img"
                                    src={homeTeam.logo}
                                    alt={homeTeam.name}
                                    sx={{ width: 64, height: 64, objectFit: "contain" }}
                                />
                                <Typography mt={1.2} fontWeight={500}>
                                    {homeTeam.name}
                                </Typography>
                            </Box>

                            {/* SCORE */}
                            <Box textAlign="center">
                                <Typography
                                    variant="h3"
                                    fontWeight={800}
                                    sx={{
                                        transform: scoreFlash ? "scale(1.12)" : "scale(1)",
                                        color: scoreFlash ? "error.main" : "text.primary",
                                        transition: "all 0.28s ease"
                                    }}
                                >
                                    {fixture.homeScore} : {fixture.awayScore}
                                </Typography>

                                <Box mt={1.2}>
                                    {getStatusChip(fixture.status)}
                                </Box>
                            </Box>

                            {/* AWAY */}
                            <Box textAlign="center" sx={{ width: 180 }}>
                                <Box
                                    component="img"
                                    src={awayTeam.logo}
                                    alt={awayTeam.name}
                                    sx={{ width: 64, height: 64, objectFit: "contain" }}
                                />
                                <Typography mt={1.2} fontWeight={500}>
                                    {awayTeam.name}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography textAlign="center" mt={2.5} color="text.secondary">
                            {formatTime(fixture.matchTime)} | {fixture.venue}
                        </Typography>
                    </CardContent>
                </Card>

                {/* TABS */}
                <Tabs
                    value={tab}
                    onChange={(e, v) => {
                        setTab(v);
                        if (v === 2) {
                            setStatsAnimateKey(k => k + 1);
                        }
                    }}
                    centered
                    sx={{
                        mb: 1,
                        "& .MuiTab-root": {
                            fontWeight: 600
                        }
                    }}
                >
                    <Tab label="Overview" />
                    <Tab label="Events" />
                    <Tab label="Stats" />
                    <Tab label="Lineups" />
                </Tabs>

                {/* CONTENT */}
                <Box sx={{ mt: 3 }}>
                    {tab === 0 && (
                        <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                            <CardContent>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Status:</strong> {fixture.status}
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Referee:</strong> {fixture.referee}
                                </Typography>
                                <Typography>
                                    <strong>Venue:</strong> {fixture.venue}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {tab === 1 && renderEvents(events, fixture.homeTeamId)}

                    {tab === 2 && renderStats(statistics)}

                    {tab === 3 && (
                        <>
                            {renderLineup(data.homeLineup, homeTeam.name, fixture.status)}
                            {renderLineup(data.awayLineup, awayTeam.name, fixture.status)}
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default MatchDetail;