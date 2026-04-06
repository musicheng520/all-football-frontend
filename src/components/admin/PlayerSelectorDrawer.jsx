// src/components/admin/PlayerSelectorDrawer.jsx
import { useState, useEffect } from "react";
import { Drawer, Box, Typography, TextField } from "@mui/material";
import { searchPlayers } from "../../api/search";

export default function PlayerSelectorDrawer({ open, onClose, onSelect }) {
    const [keyword, setKeyword] = useState("");
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        if (!keyword) {
            setPlayers([]);
            return;
        }
        const timer = setTimeout(() => {
            searchPlayers(keyword).then((res) => {
                setPlayers(res.data.data.records || []);
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [keyword]);
    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 320, p: 2 }}>
                <Typography variant="h6" mb={2}>Select Player</Typography>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search players..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: "70vh", overflowY: "auto" }}>
                    {keyword && players.length === 0 && (
                        <Typography fontSize={14} color="gray">No players found</Typography>
                    )}
                    {players.map((player) => (
                        <Box
                            key={player.id}
                            onClick={() => {
                                onSelect(player);
                                onClose();
                            }}
                            sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2, cursor: "pointer", '&:hover': { background: "#f5f5f5" } }}
                        >
                            <img src={player.photo} width={28} alt={player.name} />
                            <Typography fontWeight={500}>{player.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
}