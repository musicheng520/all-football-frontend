import { useEffect, useState } from "react";
import { Box, Select, MenuItem } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import NavTabs from "../components/common/NavTabs";
import SectionCard from "../components/common/SectionCard";
import TeamHero from "../components/layout/TeamHero";
import FollowBar from "../components/layout/FollowBar";
import NewsCard from "../components/cards/NewsCard";
import MatchCard from "../components/cards/MatchCard";
import PlayerCard from "../components/cards/PlayerCard";

import TeamSelectorDrawer from "../components/team/TeamSelectorDrawer";

import { getMyFollows } from "../api/follow";
import { getTeamDetail } from "../api/teams";
import { getNewsByTeam } from "../api/news";

const TABS = ["Overview", "News", "Players", "Matches"];

export default function TeamPage() {

    const [searchParams, setSearchParams] = useSearchParams();
    const season = parseInt(searchParams.get("season")) || 2025;

    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);

    const [teamDetail, setTeamDetail] = useState(null);
    const [news, setNews] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [squad, setSquad] = useState([]);

    const [tab, setTab] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);

    // follows
    useEffect(() => {
        getMyFollows().then(res => {
            const list = res.data.data || [];
            setTeams(list);
            if (list.length > 0) setCurrentTeam(list[0]);
        });
    }, []);

    // team
    useEffect(() => {
        if (!currentTeam) return;

        getTeamDetail(currentTeam.id, season)
            .then(res => {
                const data = res.data.data;
                setTeamDetail(data.team);
                setFixtures(data.fixtures || []);
                setSquad(data.squad || []);
            });

    }, [currentTeam, season]);

    // news
    useEffect(() => {
        if (!currentTeam) return;

        getNewsByTeam(currentTeam.id)
            .then(res => setNews(res.data.data || []));

    }, [currentTeam]);

    const following = teams.some(t => t.id === currentTeam?.id);

    if (!teamDetail) return <div>Loading...</div>;

    return (
        <Box sx={{ px: 4, py: 3 }}>

            {/* HERO */}
            <TeamHero team={teamDetail} following={following} />

            {/* FOLLOW BAR */}
            <FollowBar
                teams={teams}
                currentTeam={currentTeam}
                onSelect={setCurrentTeam}
                onAdd={() => setOpenDrawer(true)}
            />

            {/* TABS + SEASON */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <NavTabs tabs={TABS} value={tab} onChange={setTab} />

                <Box sx={{ ml: "auto" }}>
                    <Select
                        size="small"
                        value={season}
                        onChange={(e) => setSearchParams({ season: e.target.value })}
                    >
                        {[2025, 2024, 2023].map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            {/* CONTENT */}
            {tab === 1 && (
                <SectionCard>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                        gap: 2
                    }}>
                        {news.map(n => <NewsCard key={n.id} item={n} />)}
                    </Box>
                </SectionCard>
            )}

            {tab === 2 && (
                <SectionCard>
                    <Box sx={{ display: "grid", gap: 2 }}>
                        {squad.map(p => (
                            <PlayerCard key={p.id} player={p} season={season} />
                        ))}
                    </Box>
                </SectionCard>
            )}

            {tab === 3 && (
                <SectionCard>
                    <Box sx={{ display: "grid", gap: 2 }}>
                        {fixtures.map(f => <MatchCard key={f.id} match={f} />)}
                    </Box>
                </SectionCard>
            )}

            <TeamSelectorDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onSelect={setCurrentTeam}
            />

        </Box>
    );
}