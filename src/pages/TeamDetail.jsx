import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Box, Select, MenuItem, Pagination } from "@mui/material";

import NavTabs from "../components/common/NavTabs";
import SectionCard from "../components/common/SectionCard";
import TeamHero from "../components/layout/TeamHero";
import NewsCard from "../components/cards/NewsCard";
import MatchCard from "../components/cards/MatchCard";
import PlayerCard from "../components/cards/PlayerCard";
import OverviewCard from "../components/cards/OverviewCard";

import { getTeamDetail } from "../api/teams";
import { followTeam, unfollowTeam } from "../api/follow";
import { getNewsByTeam } from "../api/news";

const TABS = ["Overview", "News", "Players", "Matches"];

export default function TeamDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [teamDetail, setTeamDetail] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [squad, setSquad] = useState([]);
    const [news, setNews] = useState([]);

    const [tab, setTab] = useState(0);
    const [season, setSeason] = useState(2025);
    const [following, setFollowing] = useState(false);

    const [page, setPage] = useState(1);
    const pageSize = 6;

    // =========================
    // DATA
    // =========================
    useEffect(() => {

        getTeamDetail(id, season)
            .then(res => {
                const data = res.data.data;
                setTeamDetail(data.team);
                setFixtures(data.fixtures || []);
                setSquad(data.squad || []);
                setPage(1);
            });

    }, [id, season]);

    useEffect(() => {
        getNewsByTeam(id)
            .then(res => setNews(res.data.data || []));
    }, [id]);

    // =========================
    // FOLLOW
    // =========================
    const handleFollow = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (following) {
            await unfollowTeam(id);
            setFollowing(false);
        } else {
            await followTeam(id);
            setFollowing(true);
        }
    };

    // =========================
    // OVERVIEW（复用你之前逻辑）
    // =========================
    const overviewStats = useMemo(() => {

        const playedMatches = fixtures.filter(f => f.status === "FT");

        let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;

        playedMatches.forEach(f => {

            const isHome = f.homeTeamId === teamDetail?.id;

            const myScore = isHome ? (f.homeScore ?? 0) : (f.awayScore ?? 0);
            const oppScore = isHome ? (f.awayScore ?? 0) : (f.homeScore ?? 0);

            gf += myScore;
            ga += oppScore;

            if (myScore > oppScore) wins++;
            else if (myScore === oppScore) draws++;
            else losses++;
        });

        return {
            played: playedMatches.length,
            wins,
            draws,
            losses,
            gf,
            ga
        };

    }, [fixtures, teamDetail]);

    // =========================
    // PAGINATION
    // =========================
    const paginatedMatches = fixtures.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    if (!teamDetail) return <div>Loading...</div>;

    return (
        <Box sx={{ px: 4, py: 3 }}>

            {/* HERO（直接复用） */}
            <TeamHero
                team={teamDetail}
                isFollowed={following}
                onFollow={handleFollow}
            />

            {/* TABS + SEASON */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

                <NavTabs tabs={TABS} value={tab} onChange={setTab} />

                <Box sx={{ ml: "auto" }}>
                    <Select
                        size="small"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                    >
                        {[2025, 2024, 2023].map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* ========================= */}
            {/* OVERVIEW */}
            {/* ========================= */}
            {tab === 0 && (
                <SectionCard>
                    <OverviewCard stats={overviewStats} />
                </SectionCard>
            )}

            {/* ========================= */}
            {/* NEWS */}
            {/* ========================= */}
            {tab === 1 && (
                <SectionCard>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                        gap: 2
                    }}>
                        {news.map(n => (
                            <NewsCard key={n.id} item={n} />
                        ))}
                    </Box>
                </SectionCard>
            )}

            {/* ========================= */}
            {/* PLAYERS */}
            {/* ========================= */}
            {tab === 2 && (
                <SectionCard>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {squad.map(p => (
                            <PlayerCard key={p.id} player={p} />
                        ))}
                    </Box>
                </SectionCard>
            )}

            {/* ========================= */}
            {/* MATCHES */}
            {/* ========================= */}
            {tab === 3 && (
                <SectionCard>

                    <Box sx={{ display: "grid", gap: 2 }}>
                        {paginatedMatches.map(f => (
                            <MatchCard key={f.id} match={f} />
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            count={Math.ceil(fixtures.length / pageSize)}
                            page={page}
                            onChange={(e, v) => setPage(v)}
                        />
                    </Box>

                </SectionCard>
            )}

        </Box>
    );
}