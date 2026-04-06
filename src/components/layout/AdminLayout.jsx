// src/layouts/AdminLayout.jsx
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
    const navItems = [
        { label: "News", to: "/admin/news" },
        // 以后可以在这里继续添加其他管理模块
    ];

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* 左侧栏 */}
            <Box sx={{ width: 240, bgcolor: "#202020", color: "white", p: 2 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Admin Panel</Typography>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.to} disablePadding>
                            <ListItemButton component={NavLink} to={item.to}
                                            sx={{
                                                color: "inherit",
                                                '&.active': { bgcolor: "#333" }
                                            }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {/* 右侧内容区域 */}
            <Box sx={{ flex: 1, p: 3, bgcolor: "#f5f5f5" }}>
                <Outlet />
            </Box>
        </Box>
    );
}