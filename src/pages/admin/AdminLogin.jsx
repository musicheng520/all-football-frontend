// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    Card,
    CardContent,
    Snackbar
} from "@mui/material";
import { motion } from "framer-motion";
import { login } from "../../api/auth";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ✅ 已登录 admin 直接跳后台
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role === "ADMIN") {
            navigate("/admin/news");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setErrorMsg("");

            const res = await login({ username, password });

            if (!res.data || res.data.code !== 200) {
                setErrorMsg(res.data?.msg || "Login failed ❌");
                return;
            }

            const token = res.data.data;

            // 安全校验 token
            if (!token || typeof token !== "string" || !token.includes(".")) {
                setErrorMsg("Invalid token ❌");
                return;
            }

            // decode JWT
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role;

            // 先存（重要）
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // ❌ USER → 不允许进 admin，直接跳首页
            if (role !== "ADMIN") {
                navigate("/");
                return;
            }

            // ✅ ADMIN → 后台
            navigate("/admin/news");

        } catch (err) {
            setErrorMsg(err.response?.data?.msg || "Login failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
                px: 2
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card
                    sx={{
                        width: 420,
                        borderRadius: 5,
                        p: 2,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            textAlign="center"
                            mb={3}
                        >
                            Admin Login
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>

                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                type="submit"
                                sx={{
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    py: 1.3
                                }}
                            >
                                {loading ? "Signing in..." : "Admin Login"}
                            </Button>

                        </Box>
                    </CardContent>
                </Card>
            </motion.div>

            <Snackbar
                open={!!errorMsg}
                autoHideDuration={3000}
                onClose={() => setErrorMsg("")}
            >
                <Alert severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}