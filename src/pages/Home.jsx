
import { motion } from "framer-motion";

import { getNewsList } from "../api/news";
import { getLiveMatches, getRecentMatches, getUpcomingMatches } from "../api/fixtures";


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


function Home() {

    const [news, setNews] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);

    const [goalToast, setGoalToast] = useState(null);
    const [loading, setLoading] = useState(true);

    /*pagination*/
    const [recentPage, setRecentPage] = useState(1);
    const [upcomingPage, setUpcomingPage] = useState(1);

    const pageSize = 6;

    const recentPaginated = recentMatches.slice(
        (recentPage - 1) * pageSize,
        recentPage * pageSize
    );

    const upcomingPaginated = upcomingMatches.slice(
        (upcomingPage - 1) * pageSize,
        upcomingPage * pageSize
    );

    // =========================
    // FETCH
    // =========================
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

    // =========================
    // WebSocket
    // =========================
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

                    setLiveMatches(prev => {

                        if (!prev) return prev;

                        const prevMatch = prev.find(
                            m => (m.fixture?.id || m.id) === incomingId
                        );

                        // ⚽ GOAL
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

                        // ❌ finished remove
                        if (["FT", "AET", "PEN"].includes(status)) {
                            return prev.filter(
                                m => (m.fixture?.id || m.id) !== incomingId
                            );
                        }

                        const exists = prev.some(
                            m => (m.fixture?.id || m.id) === incomingId
                        );

                        if (!exists) return [newMatch, ...prev];

                        return prev.map(m => {
                            const id = m.fixture?.id || m.id;

                            if (id !== incomingId) return m;

                            return {
                                ...m,
                                ...newMatch
                            };
                        });

                    });

                });
            }
        });

        client.activate();

        return () => client.deactivate();

    }, []);

    // =========================
    // Skeleton
    // =========================
    const renderSkeletonGrid = () => (
        <Grid container spacing={2}>
            {[1, 2, 3].map(i => (
                <Grid item xs={12} md={4} key={i}>
                    <Skeleton variant="rounded" height={80} />
                </Grid>
            ))}
        </Grid>
    );

    // =========================
    // UI
    // =========================
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>

            {/*  GOAL TOAST */}
            {goalToast && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#d32f2f",
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

            {/*  CAROUSEL */}
            {loading
                ? <Skeleton variant="rounded" height={260} sx={{ mb: 4 }} />
                : <NewsCarousel news={news.slice(0, 5)} />
            }

            {/*  LIVE */}
            <Box sx={{ mt: 4, mb: 5 }}>
                <Typography variant="h5" mb={2}>
                    🔴 Live Matches
                </Typography>

                {loading ? (
                    renderSkeletonGrid()
                ) : (
                    <Box sx={{
                        maxWidth: 720,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>
                        {liveMatches.length === 0
                            ? <Typography>No live matches</Typography>
                            : liveMatches.map(m => (
                                <HomeMatchCard key={m.id || m.fixture?.id} match={m} />
                            ))
                        }
                    </Box>
                )}
            </Box>

            {/*  RECENT */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                    ⏱ Recent Matches
                </Typography>

                {loading ? renderSkeletonGrid() : (
                    <>
                        <Box
                            sx={{
                                maxWidth: 720,
                                mx: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.2
                            }}
                        >
                            {recentPaginated.map(m => (
                                <HomeMatchCard key={m.id} match={m} />
                            ))}
                        </Box>

                        {/* 🔥 分页 */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Pagination
                                count={Math.ceil(recentMatches.length / pageSize)}
                                page={recentPage}
                                onChange={(e, v) => setRecentPage(v)}
                                shape="rounded"
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Box>

            {/*  UPCOMING */}
            <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                    📅 Upcoming Matches
                </Typography>

                {loading ? renderSkeletonGrid() : (
                    <>
                        <Box
                            sx={{
                                maxWidth: 720,
                                mx: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.2
                            }}
                        >
                            {upcomingPaginated.map(m => (
                                <HomeMatchCard key={m.id} match={m} />
                            ))}
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Pagination
                                count={Math.ceil(upcomingMatches.length / pageSize)}
                                page={upcomingPage}
                                onChange={(e, v) => setUpcomingPage(v)}
                                shape="rounded"
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Box>

        </Container>
    );
}

export default Home;