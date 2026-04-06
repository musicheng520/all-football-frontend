// src/pages/Login.jsx
import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";
import { motion } from "framer-motion";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            const res = await login({ username, password });

            if (!res.data || res.data.code !== 200) {
                setErrorMsg(res.data?.msg || "Login failed");
                return;
            }

            const token = res.data.data;

            if (!token || typeof token !== "string" || !token.includes(".")) {
                setErrorMsg("Invalid token");
                return;
            }

            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            navigate("/profile");
        } catch (err) {
            setErrorMsg("Invalid username or password.");
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
                initial={{ opacity: 0, y: 20 }}
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
                            Welcome Back
                        </Typography>

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
                            onClick={handleLogin}
                            sx={{
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                py: 1.3
                            }}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </Button>

                        <Typography
                            textAlign="center"
                            sx={{ mt: 2, fontSize: 14 }}
                        >
                            Don’t have an account?{" "}
                            <Link to="/register">Register</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

            <Snackbar
                open={!!errorMsg}
                autoHideDuration={3000}
                onClose={() => setErrorMsg("")}
            >
                <Alert severity="error">{errorMsg}</Alert>
            </Snackbar>
        </Box>
    );
}

export default Login;