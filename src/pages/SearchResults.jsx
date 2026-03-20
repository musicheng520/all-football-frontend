import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { searchPlayers, searchTeams } from "../api/search";

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Skeleton
} from "@mui/material";

import PlayerCard from "../components/cards/PlayerCard";
import TeamCard from "../components/TeamCard";

function SearchResults() {

    const [params] = useSearchParams();
    const query = params.get("q");

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!query) return;

        setLoading(true);

        Promise.all([
            searchPlayers(query),
            searchTeams(query)
        ])
            .then(([playerRes, teamRes]) => {

                setPlayers(playerRes.data.data.records || []);
                setTeams(teamRes.data.data.records || []);

            })
            .finally(() => setLoading(false));

    }, [query]);

    return (

        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 3 }}>

            {/* HEADER */}
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mb: 3 }}
            >
                Results for "{query}"
            </Typography>


            {/* ========================= */}
            {/* 🟡 TEAMS */}
            {/* ========================= */}

            <Card sx={{ mb: 4, borderRadius: 4 }}>
                <CardContent>

                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Teams
                    </Typography>

                    {loading ? (

                        <Grid container spacing={2}>
                            {[...Array(4)].map((_, i) => (
                                <Grid item xs={6} md={3} key={i}>
                                    <Skeleton variant="rounded" height={120} />
                                </Grid>
                            ))}
                        </Grid>

                    ) : teams.length === 0 ? (

                        <Typography color="text.secondary">
                            No teams found
                        </Typography>

                    ) : (

                        <Grid container spacing={2}>
                            {teams.map(team => (
                                <Grid item xs={6} md={3} key={team.id}>
                                    <TeamCard team={team} />
                                </Grid>
                            ))}
                        </Grid>

                    )}

                </CardContent>
            </Card>


            {/* ========================= */}
            {/* 🔵 PLAYERS */}
            {/* ========================= */}

            <Card sx={{ borderRadius: 4 }}>
                <CardContent>

                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Players
                    </Typography>

                    {loading ? (

                        <Grid container spacing={2}>
                            {[...Array(8)].map((_, i) => (
                                <Grid item xs={6} md={3} key={i}>
                                    <Skeleton variant="rounded" height={140} />
                                </Grid>
                            ))}
                        </Grid>

                    ) : players.length === 0 ? (

                        <Typography color="text.secondary">
                            No players found
                        </Typography>

                    ) : (

                        <Grid container spacing={2}>
                            {players.map(player => (
                                <Grid item xs={6} md={3} key={player.id}>
                                    <PlayerCard player={player} />
                                </Grid>
                            ))}
                        </Grid>

                    )}

                </CardContent>
            </Card>

        </Box>
    );
}

export default SearchResults;