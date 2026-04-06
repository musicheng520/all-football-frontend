import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

import {
    Box,
    Typography,
    InputBase,
    Container,
    IconButton,
    Drawer,
    Stack,
    useMediaQuery,
    alpha,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";

import NavPill from "../components/NavPill";
import Footer from "../layouts/Footer";

function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:900px)");

    const token = localStorage.getItem("token");

    const [query, setQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

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

    // ✅ 完全正确的 active 判断
    const isActive = (path) => {
        const current = location.pathname;

        // 1️⃣ Home 必须完全匹配
        if (path === "/") {
            return current === "/";
        }

        // 2️⃣ 其他支持嵌套
        return current === path || current.startsWith(path + "/");
    };

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Team", path: "/team" },
        { label: "Top News", path: "/news" },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
            }}
        >
            {/* ================= Navbar ================= */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1200,
                    backdropFilter: "blur(10px)",
                    background: (theme) =>
                        alpha(theme.palette.background.paper, 0.85),
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1.5,
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
                            mr: 3,

                            // ✅ 恢复 hover 动画
                            "&:hover .logo-img": {
                                transform: "rotate(-6deg) scale(1.08)",
                            },

                            "&:hover .logo-text": {
                                opacity: 0.85,
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="All Football"
                            className="logo-img"
                            sx={{
                                height: 34,
                                transition: "transform 0.3s ease",
                            }}
                        />

                        <Typography
                            className="logo-text"
                            sx={{
                                fontWeight: 900,
                                fontSize: 20,
                                letterSpacing: "-0.5px",
                                background: "linear-gradient(90deg,#111,#4caf50)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                transition: "0.2s ease",
                            }}
                        >
                            All Football
                        </Typography>
                    </Box>

                    {/* Desktop Nav */}
                    {!isMobile && (
                        <Stack direction="row" spacing={1}>
                            {navItems.map((item) => (
                                <NavPill
                                    key={item.path}
                                    active={isActive(item.path)}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.label}
                                </NavPill>
                            ))}
                        </Stack>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Search */}
                    {!isMobile && (
                        <Box
                            sx={(theme) => ({
                                display: "flex",
                                alignItems: "center",
                                px: 2,
                                py: 0.6,
                                borderRadius: "999px",
                                minWidth: 220,
                                bgcolor: theme.palette.grey[100],
                                "&:focus-within": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    boxShadow: `0 0 0 2px ${alpha(
                                        theme.palette.primary.main,
                                        0.2
                                    )}`,
                                },
                            })}
                        >
                            <SearchIcon sx={{ fontSize: 18 }} />

                            <InputBase
                                placeholder="Search news, teams..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                sx={{ ml: 1, fontSize: 14, width: "100%" }}
                            />
                        </Box>
                    )}

                    {/* Auth */}
                    {!isMobile && (
                        <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                            {!token ? (
                                <>
                                    <NavPill
                                        active={isActive("/login")}
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </NavPill>

                                    <NavPill
                                        active={isActive("/register")}
                                        onClick={() => navigate("/register")}
                                    >
                                        Register
                                    </NavPill>
                                </>
                            ) : (
                                <>
                                    <NavPill
                                        active={isActive("/profile")}
                                        onClick={() => navigate("/profile")}
                                    >
                                        Profile
                                    </NavPill>

                                    <NavPill onClick={handleLogout}>
                                        Logout
                                    </NavPill>
                                </>
                            )}
                        </Stack>
                    )}

                    {/* Mobile Menu */}
                    {isMobile && (
                        <IconButton onClick={() => setMobileOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Container>
            </Box>

            {/* ================= Drawer ================= */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 250, p: 3 }}>
                    <Stack spacing={2}>
                        {navItems.map((item) => (
                            <NavPill
                                key={item.path}
                                active={isActive(item.path)}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                            >
                                {item.label}
                            </NavPill>
                        ))}
                    </Stack>
                </Box>
            </Drawer>

            {/* ================= 页面内容 ================= */}
            <Box sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>

            <Footer />
        </Box>
    );
}

export default MainLayout;