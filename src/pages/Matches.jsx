import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination, Button, ButtonGroup, Chip } from "@mui/material";
import { getFixtures } from "../api/fixtures";

function Matches() {

    const [matches, setMatches] = useState([]);
    const [leagueId, setLeagueId] = useState(140);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    const pageSize = 10;
    const season = 2025;


    // =========================
    // FETCH
    // =========================
    useEffect(() => {

        setLoading(true);

        getFixtures({
            leagueId,
            season,
            page,
            size: pageSize,
        })
            .then((res) => {
                const data = res.data.data;

                setMatches(data.records || []);
                setTotal(data.total || 0);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));

    }, [leagueId, page]);


    // =========================
    // HANDLERS
    // =========================
    const handleLeagueChange = (id) => {
        setLeagueId(id);
        setPage(1);
    };


    // =========================
    // HELPERS
    // =========================
    const formatMatchTime = (t) => {
        if (!t || t.length < 5) return "TBD";

        return `${t[0]}-${String(t[1]).padStart(2, "0")}-${String(t[2]).padStart(2, "0")} ${String(t[3]).padStart(2, "0")}:${String(t[4]).padStart(2, "0")}`;
    };

    const isLive = (status) => {
        return ["LIVE", "1H", "2H"].includes(status);
    };

    const getStatusChip = (status) => {

        if (isLive(status)) {
            return <Chip label="LIVE" color="error" size="small" />;
        }

        if (status === "FT") {
            return <Chip label="FT" color="success" size="small" />;
        }

        if (status === "NS") {
            return <Chip label="UPCOMING" size="small" />;
        }

        return <Chip label={status} size="small" />;
    };


    return (

        <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>

            <h1>Matches</h1>

            {/* ========================= */}
            {/* LEAGUE FILTER */}
            {/* ========================= */}
            <div style={{ marginBottom: 20 }}>

                <ButtonGroup variant="outlined">

                    <Button
                        variant={leagueId === 39 ? "contained" : "outlined"}
                        onClick={() => handleLeagueChange(39)}
                    >
                        Premier League
                    </Button>

                    <Button
                        variant={leagueId === 140 ? "contained" : "outlined"}
                        onClick={() => handleLeagueChange(140)}
                    >
                        La Liga
                    </Button>

                    <Button
                        variant={leagueId === 78 ? "contained" : "outlined"}
                        onClick={() => handleLeagueChange(78)}
                    >
                        Bundesliga
                    </Button>

                    <Button
                        variant={leagueId === 135 ? "contained" : "outlined"}
                        onClick={() => handleLeagueChange(135)}
                    >
                        Serie A
                    </Button>

                    <Button
                        variant={leagueId === 61 ? "contained" : "outlined"}
                        onClick={() => handleLeagueChange(61)}
                    >
                        Ligue 1
                    </Button>

                </ButtonGroup>

            </div>


            {/* ========================= */}
            {/* LOADING / EMPTY */}
            {/* ========================= */}
            {loading && <p>Loading matches...</p>}

            {!loading && matches.length === 0 && (
                <p>No matches found.</p>
            )}


            {/* ========================= */}
            {/* MATCH LIST */}
            {/* ========================= */}
            {!loading && matches.map((match) => {

                const time = formatMatchTime(match.matchTime);

                return (

                    <Link
                        key={match.id}
                        to={`/matches/${match.id}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >

                        <div
                            style={{
                                borderBottom: "1px solid #eee",
                                padding: "16px 0",
                                cursor: "pointer",
                                transition: "0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#fafafa";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                            }}
                        >

                            {/* ROUND */}
                            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                                {match.round}
                            </div>


                            {/* MAIN ROW */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>

                                {/* HOME */}
                                <Link
                                    to={`/teams/${match.homeTeamId}`}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        textDecoration: "none",
                                        color: "inherit",
                                        width: 150
                                    }}
                                >
                                    <img src={match.homeTeamLogo} width="24" />
                                    <span>{match.homeTeamName}</span>
                                </Link>


                                {/* SCORE */}
                                <div style={{ textAlign: "center" }}>

                                    <b style={{ fontSize: 18 }}>
                                        {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                                    </b>

                                    <div style={{ marginTop: 4 }}>
                                        {getStatusChip(match.status)}
                                    </div>

                                </div>


                                {/* AWAY */}
                                <Link
                                    to={`/teams/${match.awayTeamId}`}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        textDecoration: "none",
                                        color: "inherit",
                                        width: 150,
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <span>{match.awayTeamName}</span>
                                    <img src={match.awayTeamLogo} width="24" />
                                </Link>

                            </div>


                            {/* META */}
                            <div style={{
                                fontSize: 13,
                                color: "#666",
                                marginTop: 8,
                                textAlign: "center"
                            }}>
                                {time} | {match.venue}
                            </div>

                        </div>

                    </Link>

                );
            })}


            {/* ========================= */}
            {/* PAGINATION */}
            {/* ========================= */}
            <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>

                <Pagination
                    page={page}
                    count={Math.ceil(total / pageSize)}
                    onChange={(e, value) => setPage(value)}
                />

            </div>

        </div>
    );
}

export default Matches;