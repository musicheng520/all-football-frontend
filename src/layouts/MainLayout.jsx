import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { theme } from "../styles/theme";

import {
    Box,
    Typography,
    InputBase,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import NavPill from "../components/NavPill";

function MainLayout() {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const [query, setQuery] = useState("");

    // =============================
    // Handlers
    // =============================
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/search?q=${query}`);
            setQuery("");
        }
    };

    // =============================
    // Render
    // =============================
    return (
        <Box>

            {/* ================= Navbar ================= */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 1.5,
                    borderBottom: `1px solid ${theme.colors.neutral.grey}`,
                    background: "#fff",
                }}
            >

                {/* Logo */}
                <Typography
                    onClick={() => navigate("/")}
                    sx={{
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 20,
                        mr: 4,
                    }}
                >
                    All Football
                </Typography>

                {/* ================= 主导航 ================= */}
                <Box sx={{ display: "flex", gap: 1 }}>

                    <NavPill
                        active={location.pathname === "/"}
                        onClick={() => navigate("/")}
                    >
                        Home
                    </NavPill>

                    <NavPill
                        active={location.pathname.startsWith("/team")}
                        onClick={() => navigate("/team")}
                    >
                        Team
                    </NavPill>

                    <NavPill
                        active={location.pathname.startsWith("/news")}
                        onClick={() => navigate("/news")}
                    >
                        Top News
                    </NavPill>

                </Box>

                {/* 撑开 */}
                <Box sx={{ flexGrow: 1 }} />

                {/* ================= Search ================= */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        background: theme.colors.neutral.light,
                        px: 2,
                        py: 0.5,
                        borderRadius: "999px",
                        mr: 2,
                        minWidth: 200,
                    }}
                >
                    <SearchIcon sx={{ color: "#888" }} />

                    <InputBase
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        sx={{
                            ml: 1,
                            fontSize: 14,
                            width: "100%",
                        }}
                    />
                </Box>

                {/* ================= 右侧用户区 ================= */}
                {!token && (
                    <Box sx={{ display: "flex", gap: 1 }}>

                        <NavPill
                            active={location.pathname === "/login"}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </NavPill>

                        <NavPill
                            active={location.pathname === "/register"}
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </NavPill>

                    </Box>
                )}

                {token && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                        <NavPill
                            active={location.pathname === "/profile"}
                            onClick={() => navigate("/profile")}
                        >
                            Profile
                        </NavPill>

                        <NavPill onClick={handleLogout}>
                            Logout
                        </NavPill>

                    </Box>
                )}

            </Box>

            {/* ================= 页面内容 ================= */}
            <Box
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    px: 3,
                    py: 3,
                }}
            >
                <Outlet />
            </Box>

        </Box>
    );
}

export default MainLayout;