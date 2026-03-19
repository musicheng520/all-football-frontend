import { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from "@mui/material";

import { getTeams } from "../../api/teams";

function TeamSelectorDrawer({ open, onClose, onSelect }) {

    const [teams, setTeams] = useState([]);
    const [leagueId, setLeagueId] = useState(39);
    const [page, setPage] = useState(1);

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 78, name: "Bundesliga" },
        { id: 135, name: "Serie A" },
        { id: 61, name: "Ligue 1" }
    ];

    useEffect(() => {

        if (!open) return;

        getTeams({
            leagueId,
            season: 2025,
            page,
            size: 10
        })
            .then(res => {
                setTeams(res.data.data.records);
            })
            .catch(console.error);

    }, [open, leagueId, page]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>

            <Box sx={{ width: 320, p: 2 }}>

                <Typography variant="h6" mb={2}>
                    Select Team
                </Typography>

                {/* League */}
                <Select
                    fullWidth
                    value={leagueId}
                    onChange={(e) => {
                        setLeagueId(e.target.value);
                        setPage(1);
                    }}
                >
                    {leagues.map(l => (
                        <MenuItem key={l.id} value={l.id}>
                            {l.name}
                        </MenuItem>
                    ))}
                </Select>

                {/* List */}
                <List>

                    {teams.map(team => (

                        <ListItem
                            button
                            key={team.id}
                            onClick={() => {
                                onSelect(team);
                                onClose();
                            }}
                        >

                            <ListItemAvatar>
                                <Avatar src={team.logo} alt={team.name} />
                            </ListItemAvatar>

                            <ListItemText primary={team.name} />

                        </ListItem>

                    ))}

                </List>

            </Box>

        </Drawer>
    );
}

export default TeamSelectorDrawer;