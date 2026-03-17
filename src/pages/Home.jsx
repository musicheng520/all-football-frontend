import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getNewsList } from "../api/news";
import { getLiveMatches, getRecentMatches, getUpcomingMatches } from "../api/fixtures";
import { getMyFollows } from "../api/follow";

function Home() {

    const [news, setNews] = useState([]);

    const [liveMatches, setLiveMatches] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);

    const [followTeams, setFollowTeams] = useState([]);

    const [loading, setLoading] = useState(true);


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

                setNews(newsRes.data.data || []);

                setLiveMatches(liveRes.data.data || []);
                setRecentMatches(recentRes.data.data || []);
                setUpcomingMatches(upcomingRes.data.data || []);

            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        // follows
        getMyFollows()
            .then(res => setFollowTeams(res.data.data || []))
            .catch(() => {});

    }, []);



    // =========================
    // RENDER MATCH
    // =========================
    const renderMatch = (match) => {

        const isLive = match.status === "LIVE";

        return (
            <div
                key={match.id}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #eee"
                }}
            >

                <Link to={`/teams/${match.homeTeamId}`}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    <img src={match.homeTeamLogo} width="22" />
                    {match.homeTeamName}
                </Link>

                <div style={{ textAlign: "center" }}>
                    <b>
                        {match.homeScore ?? "-"} : {match.awayScore ?? "-"}
                    </b>

                    <div style={{
                        fontSize: 12,
                        color: isLive ? "red" : "#666"
                    }}>
                        {match.status}
                    </div>
                </div>

                <Link to={`/teams/${match.awayTeamId}`}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    {match.awayTeamName}
                    <img src={match.awayTeamLogo} width="22" />
                </Link>

                <Link to={`/matches/${match.id}`}>
                    View
                </Link>

            </div>
        );
    };



    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;



    return (

        <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>

            {/* ===================== */}
            {/* 🔥 LIVE */}
            {/* ===================== */}

            <div style={{ marginBottom: 40 }}>

                <h2>🔴 Live Matches</h2>

                {liveMatches.length === 0
                    ? <p>No live matches</p>
                    : liveMatches.map(renderMatch)
                }

            </div>



            {/* ===================== */}
            {/* ⏱ RECENT */}
            {/* ===================== */}

            <div style={{ marginBottom: 40 }}>

                <h2>⏱ Recent Matches</h2>

                {recentMatches.map(renderMatch)}

            </div>



            {/* ===================== */}
            {/* 📅 UPCOMING */}
            {/* ===================== */}

            <div style={{ marginBottom: 40 }}>

                <h2>📅 Upcoming Matches</h2>

                {upcomingMatches.map(renderMatch)}

            </div>



            {/* ===================== */}
            {/* 📰 NEWS */}
            {/* ===================== */}

            <div style={{ marginBottom: 40 }}>

                <h2>📰 News</h2>

                {news.slice(0, 5).map(n => (
                    <div key={n.id}>
                        <Link to={`/news/${n.id}`}>{n.title}</Link>
                    </div>
                ))}

            </div>



            {/* ===================== */}
            {/* ⭐ MY TEAMS */}
            {/* ===================== */}

            <div>

                <h2>⭐ My Teams</h2>

                {followTeams.length === 0 ? (

                    <div style={{ display: "flex", gap: 20 }}>
                        <Link to="/teams/33">Manchester United</Link>
                        <Link to="/teams/529">Barcelona</Link>
                    </div>

                ) : (

                    <div style={{ display: "flex", gap: 20 }}>

                        {followTeams.map(team => (
                            <Link key={team.id} to={`/teams/${team.id}`}>
                                {team.name}
                            </Link>
                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default Home;