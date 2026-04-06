// src/pages/admin/NewsPage.jsx
import { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    CircularProgress,
    Fab
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { listAdminNews, deleteAdminNews } from "../../api/adminNews";
import CreateNewsDrawer from "../../components/admin/CreateNewsDrawer";

export default function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // 获取新闻列表
    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await listAdminNews();
            setNewsList(res.data.data.records || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // 删除新闻
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this news?")) return;
        await deleteAdminNews(id);
        fetchNews();
    };

    // 格式化发布日期，避免 split 报错
    const formatDate = (publishedAt) => {
        if (!publishedAt) return "";
        try {
            const dateObj = new Date(publishedAt);
            return dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
        } catch (e) {
            // 如果日期格式异常，则直接尝试 split，或返回原字符串
            if (typeof publishedAt === "string" && publishedAt.includes("T")) {
                return publishedAt.split("T")[0];
            }
            return String(publishedAt);
        }
    };

    return (
        <Box>
            <Box
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
                <Typography variant="h5">News List</Typography>
                <Fab color="primary" onClick={() => setDrawerOpen(true)} size="small">
                    <AddIcon />
                </Fab>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : newsList.length === 0 ? (
                <Typography>No news available.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Published At</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newsList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{formatDate(item.publishedAt)}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* 新建新闻抽屉 */}
            <CreateNewsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSuccess={fetchNews}
            />
        </Box>
    );
}