import { Container, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsDetail } from "../api/news";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import { formatTime } from "../utils/format";

function NewsDetail() {

    const { id } = useParams();
    const [news, setNews] = useState(null);

    // =========================
    // FETCH
    // =========================
    const fetchData = () => {
        getNewsDetail(id).then(res => {
            setNews(res.data.data);
        });
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!news) return null;

    // =========================
    // FILTER IMAGES（核心修复）
    // =========================
    const validImages = (news.images || []).filter(
        img => typeof img === "string" && img.trim() !== ""
    );

    return (
        <Container sx={{ mt: 4, maxWidth: 900 }}>

            {/* TITLE */}
            <Typography variant="h4" fontWeight={700}>
                {news.title}
            </Typography>

            {/* META */}
            <Typography sx={{ mb: 2, color: "#666" }}>
                {news.authorName} · {formatTime(news.publishedAt)}
            </Typography>

            {/* COVER（只在有值时显示） */}
            {news.coverImage && news.coverImage.trim() !== "" && (
                <img
                    src={news.coverImage}
                    style={{
                        width: "100%",
                        borderRadius: 10,
                        marginBottom: 16
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                />
            )}

            {/* CONTENT */}
            <Typography sx={{ mt: 2, lineHeight: 1.8 }}>
                {news.content}
            </Typography>

            {/* EXTRA IMAGES */}
            {validImages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    {validImages.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            style={{
                                width: "100%",
                                marginBottom: 12,
                                borderRadius: 10
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    ))}
                </Box>
            )}

            {/* COMMENTS */}
            <Box sx={{ mt: 4 }}>
                <CommentList comments={news.comments || []} />
            </Box>

            <Box sx={{ mt: 2 }}>
                <CommentForm newsId={id} onSuccess={fetchData} />
            </Box>

        </Container>
    );
}

export default NewsDetail;