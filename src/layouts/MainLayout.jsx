import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { theme } from "../styles/theme";

import {
    Box,
    Typography,
    Button,
    InputBase
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

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

    const navItem = (path, label) => (
        <Button
            component={Link}
            to={path}
            sx={{
                color: location.pathname === path
                    ? theme.colors.primary
                    : theme.colors.neutral.black,
                fontWeight: location.pathname === path ? 600 : 400,
                textTransform: "none"
            }}
        >
            {label}
        </Button>
    );

    return (
        <Box>

            {/* 🔥 Navbar（白色版本） */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 1.5,
                    borderBottom: `1px solid ${theme.colors.neutral.grey}`,
                    background: "#fff"
                }}
            >

                {/* Logo */}
                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: theme.colors.neutral.black,
                        fontWeight: 700,
                        mr: 3
                    }}
                >
                    All Football
                </Typography>

                {/* 左侧导航 */}
                {navItem("/", "Home")}
                {navItem("/team", "Team")}
                {navItem("/news", "Top News")}

                <Box sx={{ flexGrow: 1 }} />

                {/* 🔍 Search */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        background: theme.colors.neutral.light,
                        px: 1.5,
                        borderRadius: 2,
                        mr: 2
                    }}
                >
                    <SearchIcon sx={{ color: "#888" }} />

                    <InputBase
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        sx={{ ml: 1 }}
                    />
                </Box>

                {/* 右侧 */}
                {!token && (
                    <>
                        {navItem("/login", "Login")}
                        {navItem("/register", "Register")}
                    </>
                )}

                {token && (
                    <>
                        {navItem("/profile", "Profile")}

                        <Button
                            onClick={handleLogout}
                            sx={{
                                color: theme.colors.neutral.black,
                                textTransform: "none"
                            }}
                        >
                            Logout
                        </Button>
                    </>
                )}
            </Box>

            {/* 页面内容 */}
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: 3 }}>
                <Outlet />
            </Box>

        </Box>
    );
}

export default MainLayout;