import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { Tabs, Tab, Select, MenuItem, Pagination } from "@mui/material";

import { getTeamDetail } from "../api/teams";
import { followTeam, unfollowTeam } from "../api/follow";
import { getNewsByTeam } from "../api/news";


function TeamDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [team, setTeam] = useState(null);
    const [squad, setSquad] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [news, setNews] = useState([]);

    const [following, setFollowing] = useState(false);

    const [tab, setTab] = useState(0);
    const [season, setSeason] = useState(2025);

    const [page, setPage] = useState(1);
    const pageSize = 6;



    // TEAM DETAIL
    useEffect(() => {

        getTeamDetail(id, season)
            .then(res => {

                const data = res.data.data;

                setTeam(data.team);
                setSquad(data.squad || []);
                setFixtures(data.fixtures || []);

            })
            .catch(err => {
                console.error(err);
            });

    }, [id, season]);



    // TEAM NEWS
    useEffect(() => {

        getNewsByTeam(id)
            .then(res => {

                setNews(res.data.data || []);

            })
            .catch(err => {
                console.error(err);
            });

    }, [id]);



    const handleFollow = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            if (following) {

                await unfollowTeam(id);
                setFollowing(false);

            } else {

                await followTeam(id);
                setFollowing(true);

            }

        } catch (err) {
            console.error(err);
        }

    };



    if (!team) {
        return <div>Loading...</div>;
    }



    // pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentMatches = fixtures.slice(start, end);



    return (

        <div style={{ padding: 20 }}>


            {/* Team Header */}

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

                <img src={team.logo} width="80" />

                <div>

                    <h1 style={{ margin: 0 }}>{team.name}</h1>

                    <div style={{ color: "#666" }}>
                        {team.country} | Founded {team.founded}
                    </div>

                    <div style={{ color: "#666" }}>
                        Stadium: {team.venueName}
                    </div>

                </div>

                <button
                    style={{ marginLeft: "auto", height: 36 }}
                    onClick={handleFollow}
                >
                    {following ? "Following" : "Follow"}
                </button>

            </div>



            {/* Tabs + Season */}

            <div style={{ display: "flex", alignItems: "center", marginTop: 30 }}>

                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                >
                    <Tab label="News" />
                    <Tab label="Players" />
                    <Tab label="Games" />
                    <Tab label="Stats" />
                </Tabs>

                <div style={{ marginLeft: "auto" }}>

                    <Select
                        size="small"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                    >
                        <MenuItem value={2025}>2025</MenuItem>
                        <MenuItem value={2024}>2024</MenuItem>
                        <MenuItem value={2023}>2023</MenuItem>
                        <MenuItem value={2022}>2022</MenuItem>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>
                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2018}>2018</MenuItem>
                    </Select>

                </div>

            </div>



            {/* NEWS */}

            {tab === 0 && (

                <div>

                    <h2>Team News</h2>

                    {news.length === 0 && <p>No news available.</p>}

                    {news.map(n => (

                        <div
                            key={n.id}
                            style={{
                                marginBottom: 18,
                                borderBottom: "1px solid #eee",
                                paddingBottom: 10
                            }}
                        >

                            <Link to={`/news/${n.id}`}>
                                <h4 style={{ margin: 0 }}>{n.title}</h4>
                            </Link>

                            <div style={{ fontSize: 13, color: "#666" }}>
                                {n.publishedAt}
                            </div>

                        </div>

                    ))}

                </div>

            )}



            {/* PLAYERS */}

            {tab === 1 && (

                <div>

                    <h2>Squad</h2>

                    {squad.length === 0 && <p>No players</p>}

                    {squad.map(player => (

                        <div
                            key={player.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 10
                            }}
                        >

                            <img src={player.photo} width="30" />

                            <Link to={`/players/${player.id}?season=${season}`}>
                                {player.name}
                            </Link>

                            <span style={{ color: "#666" }}>
                                ({player.age})
                            </span>

                        </div>

                    ))}

                </div>

            )}



            {/* MATCHES */}

            {tab === 2 && (

                <div>

                    <h2>Matches</h2>

                    {fixtures.length === 0 && <p>No matches</p>}

                    {currentMatches.map(match => {

                        const t = match.matchTime;

                        const date = t
                            ? `${t[0]}-${String(t[1]).padStart(2, "0")}-${String(t[2]).padStart(2, "0")} ${String(t[3]).padStart(2, "0")}:${String(t[4]).padStart(2, "0")}`
                            : "TBD";

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
                                        marginBottom: 18,
                                        borderBottom: "1px solid #eee",
                                        paddingBottom: 10,
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#fafafa";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                    }}
                                >

                                    {/* ROUND */}
                                    <div style={{ fontWeight: "bold" }}>
                                        {match.round}
                                    </div>


                                    {/* MATCH ROW */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 6
                                        }}
                                    >

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
                                            <img src={match.homeTeamLogo} width="26" />
                                            <span>{match.homeTeamName}</span>
                                        </Link>


                                        {/* SCORE（核心点击区） */}
                                        <div style={{ textAlign: "center" }}>

                                            <b style={{ fontSize: 16 }}>
                                                {match.homeScore ?? "-"} :
                                                {match.awayScore ?? "-"}
                                            </b>

                                            <div style={{ fontSize: 12, color: "#666" }}>
                                                {match.status}
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
                                            <img src={match.awayTeamLogo} width="26" />
                                        </Link>

                                    </div>


                                    {/* META */}
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: "#666",
                                            marginTop: 6,
                                            textAlign: "center"
                                        }}
                                    >
                                        {date} | {match.venue}
                                    </div>

                                </div>

                            </Link>

                        );

                    })}


                    <Pagination
                        count={Math.ceil(fixtures.length / pageSize)}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                        style={{ marginTop: 20 }}
                    />

                </div>

            )}



            {/* STATS */}

            {tab === 3 && (

                <div>

                    <h2>Team Stats</h2>

                    <p>Stats module not implemented yet.</p>

                </div>

            )}

        </div>

    );

}

export default TeamDetail;