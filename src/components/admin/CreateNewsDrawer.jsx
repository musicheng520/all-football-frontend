// src/components/admin/CreateNewsDrawer.jsx
import { useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Chip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TeamSelectorDrawer from "./TeamSelectorDrawer";
import PlayerSelectorDrawer from "./PlayerSelectorDrawer";
import { createAdminNews } from "../../api/adminNews";

export default function CreateNewsDrawer({ open, onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [cover, setCover] = useState(null);
    const [images, setImages] = useState([]);
    const [teamDrawerOpen, setTeamDrawerOpen] = useState(false);
    const [playerDrawerOpen, setPlayerDrawerOpen] = useState(false);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) setCover(file);
    };
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    // 移除已选球队或球员
    const removeTeam = (id) => setSelectedTeams((prev) => prev.filter((t) => t.id !== id));
    const removePlayer = (id) => setSelectedPlayers((prev) => prev.filter((p) => p.id !== id));

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", "general"); // 根据需求可动态设置
        selectedTeams.forEach((team) => formData.append("teamIds", team.id));
        selectedPlayers.forEach((player) => formData.append("playerIds", player.id));
        if (cover) formData.append("cover", cover);
        images.forEach((img) => formData.append("images", img));

        await createAdminNews(formData);
        // 清空表单
        setTitle("");
        setContent("");
        setSelectedTeams([]);
        setSelectedPlayers([]);
        setCover(null);
        setImages([]);
        // 回调刷新列表
        onSuccess();
        onClose();
    };

    return (
        <>
            <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
                <Box sx={{ width: 420, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h6">Create News</Typography>
                    {/* 标题 */}
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
                    {/* 内容 */}
                    <TextField
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        minRows={6}
                        fullWidth
                        required
                    />
                    {/* 封面上传 */}
                    <Box>
                        <Button component="label" variant="outlined" size="small">
                            Upload Cover
                            <input hidden type="file" accept="image/*" onChange={handleCoverChange} />
                        </Button>
                        {cover && <Typography variant="body2" sx={{ ml: 1 }}>{cover.name}</Typography>}
                    </Box>
                    {/* 多图上传 */}
                    <Box>
                        <Button component="label" variant="outlined" size="small">
                            Upload Images
                            <input hidden type="file" accept="image/*" multiple onChange={handleImagesChange} />
                        </Button>
                        {images.length > 0 && (
                            <Typography variant="body2" sx={{ ml: 1 }}>{images.length} files selected</Typography>
                        )}
                    </Box>
                    {/* 选择球队 */}
                    <Box>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setTeamDrawerOpen(true)}>
                            Select Teams
                        </Button>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                            {selectedTeams.map((t) => (
                                <Chip key={t.id} label={t.name} onDelete={() => removeTeam(t.id)} />
                            ))}
                        </Stack>
                    </Box>
                    {/* 选择球员 */}
                    <Box>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setPlayerDrawerOpen(true)}>
                            Select Players
                        </Button>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                            {selectedPlayers.map((p) => (
                                <Chip key={p.id} label={p.name} onDelete={() => removePlayer(p.id)} />
                            ))}
                        </Stack>
                    </Box>
                    {/* 提交按钮 */}
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </Box>
            </Drawer>
            {/* 球队选择抽屉 */}
            <TeamSelectorDrawer
                open={teamDrawerOpen}
                onClose={() => setTeamDrawerOpen(false)}
                onSelect={(team) => {
                    setSelectedTeams((prev) => {
                        if (!prev.find((t) => t.id === team.id)) return [...prev, team];
                        return prev;
                    });
                }}
            />
            {/* 球员选择抽屉 */}
            <PlayerSelectorDrawer
                open={playerDrawerOpen}
                onClose={() => setPlayerDrawerOpen(false)}
                onSelect={(player) => {
                    setSelectedPlayers((prev) => {
                        if (!prev.find((p) => p.id === player.id)) return [...prev, player];
                        return prev;
                    });
                }}
            />
        </>
    );
}