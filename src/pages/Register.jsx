import { useState, useMemo } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    LinearProgress
} from "@mui/material";
import { motion } from "framer-motion";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ===== 密码强度判断 =====
    const passwordValid = useMemo(() => {
        return (
            password.length >= 8 &&
            /[A-Za-z]/.test(password) &&
            /\d/.test(password)
        );
    }, [password]);

    const passwordsMatch = password === repeat;

    const formValid =
        username.trim() !== "" &&
        passwordValid &&
        passwordsMatch;

    const handleRegister = async () => {
        if (!formValid) return;

        try {
            setLoading(true);

            await register({
                username,
                password,
                role: "USER"
            });

            navigate("/login");
        } catch (err) {
            setErrorMsg("Register failed. Username may already exist.");
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
                background:
                    "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
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
                            Create Account
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
                            error={password !== "" && !passwordValid}
                            helperText={
                                password === ""
                                    ? ""
                                    : passwordValid
                                        ? "Strong password"
                                        : "Min 8 chars, include letters & numbers"
                            }
                            sx={{ mb: 1 }}
                        />

                        {password !== "" && (
                            <LinearProgress
                                variant="determinate"
                                value={passwordValid ? 100 : 40}
                                sx={{
                                    height: 6,
                                    borderRadius: 5,
                                    mb: 2
                                }}
                            />
                        )}

                        <TextField
                            fullWidth
                            type="password"
                            label="Repeat Password"
                            value={repeat}
                            onChange={(e) => setRepeat(e.target.value)}
                            error={repeat !== "" && !passwordsMatch}
                            helperText={
                                repeat === ""
                                    ? ""
                                    : passwordsMatch
                                        ? "Passwords match"
                                        : "Passwords do not match"
                            }
                            sx={{ mb: 3 }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!formValid || loading}
                            onClick={handleRegister}
                            sx={{
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                py: 1.3
                            }}
                        >
                            {loading ? "Creating..." : "Register"}
                        </Button>

                        <Typography
                            textAlign="center"
                            sx={{ mt: 2, fontSize: 14 }}
                        >
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
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

export default Register;