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
    CircularProgress,
    Skeleton,
    Snackbar,
    Alert,
    IconButton,
    Fade
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

function Profile() {

    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    // =========================
    // INIT
    // =========================
    useEffect(() => {

        const init = async () => {
            try {
                const [userRes, followRes] = await Promise.all([
                    getProfile(),
                    getMyFollows()
                ]);

                setUser(userRes.data.data);
                setTeams(followRes.data.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        init();

    }, []);

    // =========================
    // UPLOAD HANDLER
    // =========================
    const handleUpload = async (e) => {

        const file = e.target.files[0];
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
            const url = res.data.data;

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

    // =========================
    // LOADING SKELETON
    // =========================
    if (loading) {
        return (
            <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
                <Card sx={{ borderRadius: 4, p: 3 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Skeleton variant="circular" width={80} height={80} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton width="40%" height={30} />
                            <Skeleton width="25%" />
                        </Box>
                    </Stack>
                </Card>
            </Box>
        );
    }

    return (

        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>

            {/* ================= USER CARD ================= */}
            <Fade in timeout={400}>
                <Card
                    sx={{
                        borderRadius: 4,
                        mb: 3,
                        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                        transition: "0.3s",
                        "&:hover": {
                            boxShadow: "0 16px 40px rgba(0,0,0,0.08)"
                        }
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                        }}
                    >

                        {/* Avatar */}
                        <Box sx={{ position: "relative" }}>

                            <label htmlFor="avatar-upload">

                                <Avatar
                                    src={preview || user.avatar}
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        fontSize: 34,
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        "&:hover .overlay": {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    {!user.avatar && user.username?.[0]?.toUpperCase()}
                                </Avatar>

                                {/* Overlay */}
                                <Box
                                    className="overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: 90,
                                        height: 90,
                                        bgcolor: "rgba(0,0,0,0.55)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: 0,
                                        transition: "0.3s",
                                        cursor: "pointer"
                                    }}
                                >
                                    <CameraAltIcon sx={{ color: "#fff" }} />
                                </Box>

                            </label>

                            {uploading && (
                                <CircularProgress
                                    size={90}
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
                                hidden
                                onChange={handleUpload}
                            />
                        </Box>

                        {/* Info */}
                        <Box>
                            <Typography variant="h4" fontWeight={800}>
                                {user.username}
                            </Typography>

                            <Typography color="text.secondary" mt={0.5}>
                                User ID: {user.id}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1.5,
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 3,
                                    bgcolor: "primary.light",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "inline-block"
                                }}
                            >
                                {user.role}
                            </Typography>
                        </Box>

                    </CardContent>
                </Card>
            </Fade>

            {/* ================= FOLLOWED TEAMS ================= */}
            <Fade in timeout={600}>
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: "0 12px 30px rgba(0,0,0,0.06)"
                    }}
                >
                    <CardContent>

                        <Typography variant="h6" fontWeight={800} mb={2}>
                            ⭐ Followed Teams
                        </Typography>

                        {teams.length === 0 ? (
                            <Typography color="text.secondary">
                                You are not following any teams yet.
                            </Typography>
                        ) : (
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                gap={1.5}
                            >
                                {teams.map(team => (
                                    <Chip
                                        key={team.id}
                                        label={team.name}
                                        component={Link}
                                        to={`/teams/${team.id}`}
                                        clickable
                                        sx={{
                                            px: 1,
                                            fontWeight: 600,
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
            </Fade>

            {/* ================= ERROR SNACKBAR ================= */}
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            </Snackbar>

        </Box>
    );
}

export default Profile;