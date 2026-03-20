import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { theme } from "../styles/theme";
import logo from "../assets/logo.png";

import {
    Box,
    Typography,
    InputBase,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import NavPill from "../components/NavPill";
import Footer from "../layouts/Footer"; //

function MainLayout() {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const [query, setQuery] = useState("");

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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#f7f9fc"
            }}
        >

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
                <Box
                    onClick={() => navigate("/")}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        cursor: "pointer",
                        mr: 4,

                        "&:hover .logo-img": {
                            transform: "rotate(-8deg) scale(1.05)"
                        },

                        "&:hover .logo-text": {
                            opacity: 0.85
                        }
                    }}
                >

                    <Box
                        component="img"
                        src={logo}
                        alt="All Football"
                        className="logo-img"
                        sx={{
                            height: 34,
                            transition: "0.25s ease"
                        }}
                    />

                    <Typography
                        className="logo-text"
                        sx={{
                            fontWeight: 800,
                            fontSize: 20,
                            letterSpacing: "-0.5px",
                            background: "linear-gradient(90deg,#111,#4caf50)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            transition: "0.2s"
                        }}
                    >
                        All Football
                    </Typography>

                </Box>

                {/* Nav */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <NavPill active={location.pathname === "/"} onClick={() => navigate("/")}>
                        Home
                    </NavPill>

                    <NavPill active={location.pathname.startsWith("/team")} onClick={() => navigate("/team")}>
                        Team
                    </NavPill>

                    <NavPill active={location.pathname.startsWith("/news")} onClick={() => navigate("/news")}>
                        Top News
                    </NavPill>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Search */}
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
                        sx={{ ml: 1, fontSize: 14, width: "100%" }}
                    />
                </Box>

                {/* Auth */}
                {!token && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <NavPill active={location.pathname === "/login"} onClick={() => navigate("/login")}>
                            Login
                        </NavPill>

                        <NavPill active={location.pathname === "/register"} onClick={() => navigate("/register")}>
                            Register
                        </NavPill>
                    </Box>
                )}

                {token && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <NavPill active={location.pathname === "/profile"} onClick={() => navigate("/profile")}>
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
                    flex: 1,  // 关键：让Footer自动到底
                    maxWidth: "1200px",
                    margin: "0 auto",
                    px: 3,
                    py: 3,
                    width: "100%"
                }}
            >
                <Outlet />
            </Box>

            {/* ================= Footer ================= */}
            <Footer />

        </Box>
    );
}

export default MainLayout;