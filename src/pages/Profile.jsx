import { useEffect, useState } from "react";
import { getProfile, uploadAvatar } from "../api/auth";
import { getMyFollows } from "../api/follow";
import { Link } from "react-router-dom";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Stack,
    CircularProgress
} from "@mui/material";

function Profile() {

    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    // =========================
    // INIT
    // =========================
    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchFollows = async () => {
            try {
                const res = await getMyFollows();
                setTeams(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
        fetchFollows();

    }, []);

    // =========================
    // UPLOAD HANDLER
    // =========================
    const handleUpload = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        setError("");

        // ❗限制类型
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // ❗限制大小（2MB）
        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be smaller than 2MB");
            return;
        }

        // 🔥 preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        try {
            setUploading(true);

            const res = await uploadAvatar(file);
            const url = res.data.data;

            // 🔥 更新用户头像
            setUser(prev => ({
                ...prev,
                avatar: url
            }));

            setPreview(null);

        } catch (err) {
            console.error(err);
            setError("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return <Typography sx={{ p: 4 }}>Loading...</Typography>;
    }

    return (

        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>

            {/* 👤 USER CARD */}
            <Card
                sx={{
                    borderRadius: 4,
                    mb: 3,
                    boxShadow: "0 10px 28px rgba(0,0,0,0.07)"
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                    }}
                >

                    {/* Avatar Upload */}
                    <Box sx={{ position: "relative" }}>

                        <label htmlFor="avatar-upload">
                            <Avatar
                                src={preview || user.avatar}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: 30,
                                    bgcolor: "#1976d2",
                                    cursor: "pointer",
                                    transition: "0.2s",

                                    "&:hover": {
                                        opacity: 0.8
                                    }
                                }}
                            >
                                {!user.avatar && user.username?.[0]?.toUpperCase()}
                            </Avatar>
                        </label>

                        {/* loading */}
                        {uploading && (
                            <CircularProgress
                                size={80}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0
                                }}
                            />
                        )}

                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleUpload}
                        />

                    </Box>

                    {/* Info */}
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {user.username}
                        </Typography>

                        <Typography color="text.secondary">
                            ID: {user.id}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                background: "#f1f5f9",
                                fontSize: 12,
                                fontWeight: 600,
                                display: "inline-block"
                            }}
                        >
                            {user.role}
                        </Typography>

                        {/* error */}
                        {error && (
                            <Typography color="error" mt={1} fontSize={13}>
                                {error}
                            </Typography>
                        )}
                    </Box>

                </CardContent>
            </Card>

            {/* ⭐ FOLLOWED TEAMS */}
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: "0 10px 28px rgba(0,0,0,0.07)"
                }}
            >
                <CardContent>

                    <Typography variant="h6" fontWeight={700} mb={2}>
                        ⭐ Followed Teams
                    </Typography>

                    {teams.length === 0 ? (
                        <Typography color="text.secondary">
                            No followed teams.
                        </Typography>
                    ) : (
                        <Stack direction="row" flexWrap="wrap" gap={1.5}>
                            {teams.map(team => (
                                <Chip
                                    key={team.id}
                                    label={team.name}
                                    component={Link}
                                    to={`/teams/${team.id}`}
                                    clickable
                                    sx={{
                                        px: 1,
                                        fontWeight: 500,
                                        borderRadius: 2
                                    }}
                                />
                            ))}
                        </Stack>
                    )}

                </CardContent>
            </Card>

        </Box>
    );
}

export default Profile;