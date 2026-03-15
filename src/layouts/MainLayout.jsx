import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    InputBase
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function MainLayout() {

    const navigate = useNavigate();

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

        <Box>

            <AppBar position="static">

                <Toolbar>

                    {/* Logo */}

                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            color: "white",
                            textDecoration: "none",
                            mr: 3
                        }}
                    >
                        All Football
                    </Typography>

                    {/* Navigation */}

                    <Button color="inherit" component={Link} to="/matches">
                        Matches
                    </Button>

                    <Button color="inherit" component={Link} to="/teams">
                        Teams
                    </Button>

                    <Button color="inherit" component={Link} to="/players">
                        Players
                    </Button>

                    <Button color="inherit" component={Link} to="/news">
                        News
                    </Button>

                    {/* Spacer */}

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Search */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            background: "white",
                            px: 1,
                            borderRadius: 1,
                            mr: 2
                        }}
                    >

                        <SearchIcon />

                        <InputBase
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            sx={{ ml: 1 }}
                        />

                    </Box>

                    {/* Auth */}

                    {!token && (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>

                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}

                    {token && (
                        <>
                            <Button color="inherit" component={Link} to="/profile">
                                Profile
                            </Button>

                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}

                </Toolbar>

            </AppBar>

            {/* Page content */}

            <Box sx={{ p: 3 }}>

                <Outlet />

            </Box>

        </Box>

    );
}

export default MainLayout;