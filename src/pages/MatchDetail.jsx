import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

import { getFixtureDetail } from "../api/fixtures";

function MatchDetail() {

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);


    // =========================
    // FETCH
    // =========================
    useEffect(() => {

        setLoading(true);

        getFixtureDetail(id)
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [id]);


    // =========================
    // HELPERS
    // =========================
    const formatTime = (t) => {
        if (!t || t.length < 5) return "TBD";
        return `${t[0]}-${t[1]}-${t[2]} ${t[3]}:${t[4]}`;
    };


    // 去重 events（很关键）
    const deduplicateEvents = (events) => {

        const seen = new Set();

        return events.filter(e => {
            const key = `${e.minute}-${e.playerId}-${e.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };


    const renderEvents = (events, homeId) => {

        const cleanEvents = deduplicateEvents(events)
            .sort((a, b) => a.minute - b.minute);

        return cleanEvents.map((e, i) => {

            const isHome = e.teamId === homeId;

            return (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        justifyContent: isHome ? "flex-start" : "flex-end",
                        marginBottom: 10
                    }}
                >
                    <div style={{
                        background: "#f5f5f5",
                        padding: 10,
                        borderRadius: 8,
                        maxWidth: "60%"
                    }}>
                        <b>{e.minute}'</b> {e.type} - {e.playerName}

                        {e.assistPlayerName && (
                            <div style={{ fontSize: 12, color: "#666" }}>
                                Assist: {e.assistPlayerName}
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };


    const renderStats = (stats) => {

        if (!stats || !stats.home || !stats.away) {
            return <p>No statistics available</p>;
        }

        const keys = [
            "shotsTotal",
            "shotsOnTarget",
            "possession",
            "fouls",
            "corners",
            "yellowCards",
            "offsides"
        ];

        return keys.map(key => (
            <div key={key} style={{ marginBottom: 8 }}>
                <b>{key}</b> : {stats.home[key]} - {stats.away[key]}
            </div>
        ));
    };


    const renderLineup = (lineup, teamName, status) => {

        if (!lineup) {
            return <p>{teamName}: Lineup not available</p>;
        }

        if (!lineup.startingXI || lineup.startingXI.length === 0) {

            if (status === "NS") return <p>{teamName}: Lineups will be available before kickoff</p>;
            if (status === "LIVE") return <p>{teamName}: Loading lineup...</p>;

            return <p>{teamName}: No lineup data</p>;
        }

        return (
            <div>

                <h4>{teamName} ({lineup.formation})</h4>
                <p>Coach: {lineup.coach}</p>

                <h5>Starting XI</h5>
                {lineup.startingXI.map(p => (
                    <div key={p.playerId}>{p.playerName}</div>
                ))}

                <h5>Substitutes</h5>
                {lineup.substitutes.map(p => (
                    <div key={p.playerId}>{p.playerName}</div>
                ))}

            </div>
        );
    };


    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data</p>;

    const { fixture, homeTeam, awayTeam, events, statistics } = data;


    return (

        <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>

            {/* ===================== */}
            {/* HEADER */}
            {/* ===================== */}

            <Box sx={{ textAlign: "center", mb: 3 }}>

                <h2>{fixture.round}</h2>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    <Box>
                        <img src={homeTeam.logo} width="60" />
                        <div>{homeTeam.name}</div>
                    </Box>

                    <Box>
                        <h1>{fixture.homeScore} : {fixture.awayScore}</h1>
                        <div style={{ color: "red" }}>{fixture.status}</div>
                    </Box>

                    <Box>
                        <img src={awayTeam.logo} width="60" />
                        <div>{awayTeam.name}</div>
                    </Box>

                </Box>

                <div style={{ color: "#666", marginTop: 10 }}>
                    {formatTime(fixture.matchTime)} | {fixture.venue}
                </div>

            </Box>



            {/* ===================== */}
            {/* TABS */}
            {/* ===================== */}

            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
                <Tab label="Overview" />
                <Tab label="Events" />
                <Tab label="Stats" />
                <Tab label="Lineups" />
            </Tabs>



            {/* ===================== */}
            {/* CONTENT */}
            {/* ===================== */}

            <Box sx={{ mt: 3 }}>

                {tab === 0 && (
                    <div>
                        <p>Status: {fixture.status}</p>
                        <p>Referee: {fixture.referee}</p>
                        <p>Venue: {fixture.venue}</p>
                    </div>
                )}

                {tab === 1 && renderEvents(events, fixture.homeTeamId)}

                {tab === 2 && renderStats(statistics)}

                {tab === 3 && (
                    <div>
                        {renderLineup(data.homeLineup, homeTeam.name, fixture.status)}
                        {renderLineup(data.awayLineup, awayTeam.name, fixture.status)}
                    </div>
                )}

            </Box>

        </Box>
    );
}

export default MatchDetail;