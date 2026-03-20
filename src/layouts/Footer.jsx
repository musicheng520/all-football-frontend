import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export default function Footer() {

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
                mt: 10,
                pt: 6,
                pb: 3,
                px: 3,
                background: "linear-gradient(135deg, #0f172a, #111827)",
                color: "#fff"
            }}
        >

            <Box sx={{ maxWidth: 1200, mx: "auto" }}>

                <Grid container spacing={4}>

                    {/* 🔥 BRAND */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <SportsSoccerIcon />
                            <Typography fontWeight={700} fontSize={18}>
                                All Football
                            </Typography>
                        </Box>

                        <Typography fontSize={14} sx={{ opacity: 0.7 }}>
                            Real-time football data & live match platform.
                            Built with modern full-stack architecture.
                        </Typography>
                    </Grid>

                    {/* 🔗 LINKS */}
                    <Grid item xs={6} md={2}>
                        <Typography fontWeight={600} mb={1}>
                            Links
                        </Typography>

                        <FooterLink to="/">Home</FooterLink>
                        <FooterLink to="/teams">Teams</FooterLink>
                        <FooterLink to="/news">News</FooterLink>
                        <FooterLink to="/profile">Profile</FooterLink>
                    </Grid>

                    {/* ⚙️ TECH */}
                    <Grid item xs={6} md={3}>
                        <Typography fontWeight={600} mb={1}>
                            Tech
                        </Typography>

                        <Typography sx={textStyle}>Spring Boot</Typography>
                        <Typography sx={textStyle}>React + MUI</Typography>
                        <Typography sx={textStyle}>WebSocket</Typography>
                        <Typography sx={textStyle}>Redis + MySQL</Typography>
                    </Grid>

                    {/* 📬 CONTACT */}
                    <Grid item xs={12} md={3}>
                        <Typography fontWeight={600} mb={1}>
                            Contact
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>

                            <IconButton
                                sx={iconStyle}
                                onClick={() => window.open("https://github.com/", "_blank")}
                            >
                                <GitHubIcon />
                            </IconButton>

                            <IconButton sx={iconStyle}>
                                <EmailIcon />
                            </IconButton>

                        </Box>

                        <Typography fontSize={12} sx={{ mt: 1, opacity: 0.6 }}>
                            Contact available upon request
                        </Typography>
                    </Grid>

                </Grid>

                {/* 🔥 DIVIDER */}
                <Box
                    sx={{
                        height: 1,
                        background: "rgba(255,255,255,0.1)",
                        my: 4
                    }}
                />

                {/* 🔻 BOTTOM */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 1
                    }}
                >
                    <Typography fontSize={12} sx={{ opacity: 0.6 }}>
                        © {new Date().getFullYear()} All Football
                    </Typography>

                    <Typography fontSize={12} sx={{ opacity: 0.6 }}>
                        Built as a full-stack real-time system using Spring Boot + React
                    </Typography>
                </Box>

            </Box>
        </Box>
    );
}

/* 🔗 Link Component */
function FooterLink({ to, children }) {
    return (
        <Typography
            component={Link}
            to={to}
            sx={{
                display: "block",
                fontSize: 14,
                color: "#aaa",
                textDecoration: "none",
                mb: 0.5,
                transition: "0.2s",
                "&:hover": {
                    color: "#fff",
                    transform: "translateX(4px)"
                }
            }}
        >
            {children}
        </Typography>
    );
}

/* styles */
const textStyle = {
    fontSize: 14,
    opacity: 0.7
};

const iconStyle = {
    color: "#aaa",
    background: "rgba(255,255,255,0.05)",
    "&:hover": {
        color: "#fff",
        background: "rgba(255,255,255,0.15)"
    }
};