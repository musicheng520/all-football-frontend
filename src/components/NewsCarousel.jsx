import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const DEFAULT_IMG =
    "https://via.placeholder.com/800x400?text=No+Image";

export default function NewsCarousel({ news = [] }) {
    const navigate = useNavigate();
    if (!news.length) return null;

    return (
        <Box sx={{ mb: 6 }}>
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3500 }}
                pagination={{ clickable: true }}
                loop
            >
                {news.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Box
                            onClick={() => navigate(`/news/${item.id}`)}
                            sx={{
                                height: 320,
                                borderRadius: 4,
                                overflow: "hidden",
                                position: "relative",
                                cursor: "pointer",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                                "&:hover img": {
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <img
                                src={item.coverImage || DEFAULT_IMG}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "0.4s"
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    width: "100%",
                                    p: 4,
                                    background:
                                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)"
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color="#fff"
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}