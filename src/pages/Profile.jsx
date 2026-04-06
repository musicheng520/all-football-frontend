import { useEffect, useState } from "react";
import { getProfile, uploadAvatar } from "../api/auth";
import { getMyFollows } from "../api/follow";
import { Link } from "react-router-dom";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Stack,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
    Button
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function Profile() {
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    // ================= INIT =================
    useEffect(() => {
        const init = async () => {
            try {
                const [u, t] = await Promise.all([
                    getProfile(),
                    getMyFollows()
                ]);

                setUser(u?.data?.data);
                setTeams(t?.data?.data || []);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    // ================= UPLOAD =================
    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be smaller than 2MB");
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        try {
            setUploading(true);
            const res = await uploadAvatar(file);
            const url = res?.data?.data;

            setUser((prev) => ({ ...prev, avatar: url }));
            setPreview(null);
        } catch {
            setError("Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    if (loading) return null;
    if (!user) return null;

    const followCount = teams.length;

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", mt: 5, px: 2 }}>

            <Grid container spacing={4}>

                {/* ================= LEFT COLUMN (5/12) ================= */}
                <Grid item xs={12} md={5}>
                    <Box
                        sx={{
                            position: { md: "sticky" },
                            top: { md: 100 }
                        }}
                    >
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                                border: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>

                                <Stack spacing={3} alignItems="center">

                                    {/* Avatar */}
                                    <Box sx={{ position: "relative" }}>
                                        <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                                            <Avatar
                                                src={preview || user.avatar}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    fontSize: 42,
                                                    bgcolor: "primary.main",
                                                    transition: "0.3s",
                                                    "&:hover": { opacity: 0.9 }
                                                }}
                                            >
                                                {!user.avatar && user.username?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </label>

                                        {uploading && (
                                            <CircularProgress
                                                size={120}
                                                sx={{ position: "absolute", top: 0, left: 0 }}
                                            />
                                        )}

                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleUpload}
                                        />
                                    </Box>

                                    {/* Info */}
                                    <Box textAlign="center">
                                        <Typography variant="h4" fontWeight={900}>
                                            {user.username}
                                        </Typography>

                                        <Typography color="text.secondary" mt={1}>
                                            User ID: {user.id}
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                px: 2.5,
                                                py: 0.7,
                                                borderRadius: 3,
                                                bgcolor: "primary.light",
                                                fontWeight: 800,
                                                display: "inline-block"
                                            }}
                                        >
                                            {user.role}
                                        </Box>
                                    </Box>

                                    <Divider sx={{ width: "100%" }} />

                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        startIcon={<LogoutIcon />}
                                        sx={{ borderRadius: 3 }}
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            window.location.href = "/";
                                        }}
                                    >
                                        Logout
                                    </Button>

                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>

                {/* ================= RIGHT COLUMN (7/12) ================= */}
                <Grid item xs={12} md={7}>
                    <Stack spacing={4}>

                        {/* Followed Teams */}
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                                border: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight={900} mb={2}>
                                    ⭐ Followed Teams
                                </Typography>

                                {followCount === 0 ? (
                                    <Typography color="text.secondary">
                                        You are not following any teams yet.
                                    </Typography>
                                ) : (
                                    <Stack direction="row" flexWrap="wrap" gap={1.5}>
                                        {teams.map((team) => (
                                            <Chip
                                                key={team.id}
                                                label={team.name}
                                                component={Link}
                                                to={`/teams/${team.id}`}
                                                clickable
                                                sx={{
                                                    fontWeight: 700,
                                                    borderRadius: 3,
                                                    transition: "0.2s",
                                                    "&:hover": {
                                                        transform: "translateY(-2px)"
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>

                        {/* Activity Block */}
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
                                border: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight={900} mb={2}>
                                    📊 Account Summary
                                </Typography>

                                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                    You are following {followCount} team{followCount !== 1 && "s"}.
                                    Explore live matches and top news to personalize your feed.
                                </Typography>
                            </CardContent>
                        </Card>

                    </Stack>
                </Grid>

            </Grid>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError("")}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>

        </Box>
    );
}

export default Profile;