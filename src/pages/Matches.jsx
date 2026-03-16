import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination, Button, ButtonGroup } from "@mui/material";
import { getFixtures } from "../api/fixtures";

function Matches() {
    const [matches, setMatches] = useState([]);
    const [leagueId, setLeagueId] = useState(140);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    const pageSize = 10;
    const season = 2025;

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
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [leagueId, page]);

    const handleLeagueChange = (newLeagueId) => {
        setLeagueId(newLeagueId);
        setPage(1);
    };

    const formatMatchTime = (t) => {
        if (!t || t.length < 5) return "TBD";

        return `${t[0]}-${String(t[1]).padStart(2, "0")}-${String(t[2]).padStart(2, "0")} ${String(t[3]).padStart(2, "0")}:${String(t[4]).padStart(2, "0")}`;
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Matches</h1>

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

            {loading && <p>Loading matches...</p>}

            {!loading && matches.length === 0 && <p>No matches found.</p>}

            {!loading &&
                matches.map((match) => {
                    const time = formatMatchTime(match.matchTime);

                    return (
                        <div
                            key={match.id}
                            style={{
                                borderBottom: "1px solid #eee",
                                padding: "14px 0",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    marginBottom: 8,
                                }}
                            >
                                {match.round}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Link
                                    to={`/teams/${match.homeTeamId}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <img
                                        src={match.homeTeamLogo}
                                        alt={match.homeTeamName}
                                        width="24"
                                        height="24"
                                    />
                                    <span>{match.homeTeamName}</span>
                                </Link>

                                <b style={{ margin: "0 10px" }}>
                                    {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                                </b>

                                <Link
                                    to={`/teams/${match.awayTeamId}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <img
                                        src={match.awayTeamLogo}
                                        alt={match.awayTeamName}
                                        width="24"
                                        height="24"
                                    />
                                    <span>{match.awayTeamName}</span>
                                </Link>
                            </div>

                            <div
                                style={{
                                    fontSize: 13,
                                    color: "#666",
                                    marginTop: 6,
                                }}
                            >
                                {time} | {match.venue} | {match.status}
                            </div>
                        </div>
                    );
                })}

            <div style={{ marginTop: 24 }}>
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