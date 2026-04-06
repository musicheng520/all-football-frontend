import {
    Container,
    Typography,
    Box,
    Divider,
    Skeleton,
    Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsDetail } from "../api/news";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import { formatTime } from "../utils/format";
import { motion } from "framer-motion";

function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
        getNewsDetail(id)
            .then((res) => {
                setNews(res.data.data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Skeleton variant="text" height={50} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rounded" height={300} sx={{ mt: 3 }} />
            </Container>
        );
    }

    if (!news) return null;

    const validImages = (news.images || []).filter(
        (img) => typeof img === "string" && img.trim() !== ""
    );

    return (
        <Box
            sx={{
                background: "linear-gradient(180deg,#f7f9fc 0%,#ffffff 60%)",
                py: 6
            }}
        >
            <Container maxWidth="md">

                {/* Article Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                    }}
                >

                    {/* Title */}
                    <Typography
                        variant="h3"
                        fontWeight={900}
                        sx={{
                            lineHeight: 1.2,
                            mb: 2
                        }}
                    >
                        {news.title}
                    </Typography>

                    {/* Meta */}
                    <Typography
                        sx={{
                            color: "text.secondary",
                            mb: 3,
                            fontSize: 14
                        }}
                    >
                        {news.authorName} · {formatTime(news.publishedAt)}
                    </Typography>

                    {/* Cover */}
                    {news.coverImage?.trim() && (
                        <Box
                            component={motion.img}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            src={news.coverImage}
                            sx={{
                                width: "100%",
                                borderRadius: 3,
                                mb: 4,
                                objectFit: "cover"
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    )}

                    {/* Content */}
                    <Typography
                        sx={{
                            fontSize: 17,
                            lineHeight: 1.9,
                            color: "text.primary",
                            whiteSpace: "pre-line"
                        }}
                    >
                        {news.content}
                    </Typography>

                    {/* Extra Images */}
                    {validImages.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            {validImages.map((img, i) => (
                                <Box
                                    key={i}
                                    component={motion.img}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    src={img}
                                    sx={{
                                        width: "100%",
                                        borderRadius: 3,
                                        mb: 3,
                                        objectFit: "cover"
                                    }}
                                    onError={(e) => (e.target.style.display = "none")}
                                />
                            ))}
                        </Box>
                    )}

                </Paper>

                {/* Comments Section */}
                <Box
                    sx={{
                        mt: 6,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        background: "#ffffff",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
                    }}
                >
                    <Typography variant="h6" fontWeight={800} mb={2}>
                        Comments
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <CommentList comments={news.comments || []} />

                    <Box sx={{ mt: 4 }}>
                        <CommentForm newsId={id} onSuccess={fetchData} />
                    </Box>
                </Box>

            </Container>
        </Box>
    );
}

export default NewsDetail;