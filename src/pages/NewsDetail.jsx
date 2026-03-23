import { Container, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsDetail } from "../api/news";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import { formatTime } from "../utils/format";

const DEFAULT_IMG = "https://via.placeholder.com/800x400?text=No+Image";

function NewsDetail() {

    const { id } = useParams();
    const [news, setNews] = useState(null);

    const fetchData = () => {
        getNewsDetail(id).then(res => {
            setNews(res.data.data);
        });
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!news) return null;

    return (
        <Container sx={{ mt: 4 }}>

            <Typography variant="h4" fontWeight={700}>
                {news.title}
            </Typography>

            <Typography sx={{ mb: 2, color: "#666" }}>
                {news.authorName} · {formatTime(news.publishedAt)}
            </Typography>

            <img
                src={news.coverImage || DEFAULT_IMG}
                style={{ width: "100%", borderRadius: 10 }}
            />

            <Typography sx={{ mt: 3 }}>
                {news.content}
            </Typography>

            {/* images */}
            {news.images?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    {news.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            style={{ width: "100%", marginBottom: 12, borderRadius: 10 }}
                        />
                    ))}
                </Box>
            )}

            <CommentList comments={news.comments || []} />

            <CommentForm newsId={id} onSuccess={fetchData} />

        </Container>
    );
}

export default NewsDetail;