import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import {
    Container,
    Typography,
    Box,
    Grid,
    Skeleton,
    Pagination
} from "@mui/material";

import NewsCarousel from "../components/NewsCarousel";
import HomeMatchCard from "../components/cards/HomeMatchCard";
import {
    getLiveMatches,
    getRecentMatches,
    getUpcomingMatches
} from "../api/fixtures";
import {getNewsList} from "../api/news";

function Home() {
    const [news, setNews] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);

    const [goalToast, setGoalToast] = useState(null);
    const [loading, setLoading] = useState(true);

    const pageSize = 6;
    const [recentPage, setRecentPage] = useState(1);
    const [upcomingPage, setUpcomingPage] = useState(1);

    const recentPaginated = recentMatches.slice(
        (recentPage - 1) * pageSize,
        recentPage * pageSize
    );

    const upcomingPaginated = upcomingMatches.slice(
        (upcomingPage - 1) * pageSize,
        upcomingPage * pageSize
    );

    // ========================= FETCH
    useEffect(() => {
        setLoading(true);

        Promise.all([
            getNewsList(),
            getLiveMatches(),
            getRecentMatches(),
            getUpcomingMatches()
        ])
            .then(([newsRes, liveRes, recentRes, upcomingRes]) => {
                setNews(newsRes?.data?.data || []);
                setLiveMatches(liveRes?.data?.data || []);
                setRecentMatches(recentRes?.data?.data || []);
                setUpcomingMatches(upcomingRes?.data?.data || []);
            })
            .finally(() => setLoading(false));
    }, []);

    // ========================= WEBSOCKET
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/live", (msg) => {
                    const newMatch = JSON.parse(msg.body);
                    const incomingId = newMatch?.fixture?.id;
                    if (!incomingId) return;

                    setLiveMatches((prev) => {
                        const prevMatch = prev.find(
                            (m) => (m.fixture?.id || m.id) === incomingId
                        );

                        if (prevMatch) {
                            const oldHome = prevMatch.goals?.home ?? 0;
                            const oldAway = prevMatch.goals?.away ?? 0;
                            const newHome = newMatch.goals?.home ?? oldHome;
                            const newAway = newMatch.goals?.away ?? oldAway;

                            if (oldHome !== newHome || oldAway !== newAway) {
                                setGoalToast({
                                    text: `⚽ ${newMatch.teams?.home?.name} ${newHome}-${newAway} ${newMatch.teams?.away?.name}`
                                });
                                setTimeout(() => setGoalToast(null), 2500);
                            }
                        }

                        const status = newMatch.fixture?.status?.short;

                        if (["FT", "AET", "PEN"].includes(status)) {
                            return prev.filter(
                                (m) => (m.fixture?.id || m.id) !== incomingId
                            );
                        }

                        const exists = prev.some(
                            (m) => (m.fixture?.id || m.id) === incomingId
                        );

                        if (!exists) return [newMatch, ...prev];

                        return prev.map((m) => {
                            const id = m.fixture?.id || m.id;
                            if (id !== incomingId) return m;
                            return { ...m, ...newMatch };
                        });
                    });
                });
            }
        });

        client.activate();
        return () => client.deactivate();
    }, []);

    const renderSkeleton = () => (
        <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
                <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rounded" height={90} />
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg, #f7f9fc 0%, #ffffff 50%)"
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* GOAL TOAST */}
                {goalToast && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            position: "fixed",
                            top: 20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#ff3b30",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: 30,
                            fontWeight: 600,
                            zIndex: 9999
                        }}
                    >
                        {goalToast.text}
                    </motion.div>
                )}

                {/* HERO */}
                {loading ? (
                    <Skeleton variant="rounded" height={300} sx={{ mb: 5 }} />
                ) : (
                    <NewsCarousel news={news.slice(0, 5)} />
                )}

                {/* LIVE SECTION */}
                <Section title="Live Matches" accent="#ff3b30">
                    {loading
                        ? renderSkeleton()
                        : liveMatches.length === 0
                            ? <Empty text="No Live Matches Right Now" />
                            : liveMatches.map((m) => (
                                <HomeMatchCard
                                    key={m.id || m.fixture?.id}
                                    match={m}
                                />
                            ))}
                </Section>

                {/* RECENT SECTION */}
                <Section title="Recent Matches">
                    {loading
                        ? renderSkeleton()
                        : recentPaginated.map((m) => (
                            <HomeMatchCard key={m.id} match={m} />
                        ))}

                    <Pagination
                        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                        count={Math.ceil(recentMatches.length / pageSize)}
                        page={recentPage}
                        onChange={(e, v) => setRecentPage(v)}
                        shape="rounded"
                        color="primary"
                    />
                </Section>

                {/* UPCOMING SECTION */}
                <Section title="Upcoming Matches">
                    {loading
                        ? renderSkeleton()
                        : upcomingPaginated.map((m) => (
                            <HomeMatchCard key={m.id} match={m} />
                        ))}

                    <Pagination
                        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                        count={Math.ceil(upcomingMatches.length / pageSize)}
                        page={upcomingPage}
                        onChange={(e, v) => setUpcomingPage(v)}
                        shape="rounded"
                        color="primary"
                    />
                </Section>

            </Container>
        </Box>
    );
}

function Section({ title, accent = "#7ED957", children }) {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: accent
                    }}
                />
                <Typography variant="h5" fontWeight={800}>
                    {title}
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 3,
                    borderRadius: 4,
                    background: "#ffffff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

function Empty({ text }) {
    return (
        <Box sx={{ py: 4, textAlign: "center", color: "#888" }}>
            <Typography fontWeight={600}>{text}</Typography>
        </Box>
    );
}

export default Home;