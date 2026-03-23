import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

const DEFAULT_IMG = "https://via.placeholder.com/800x400?text=No+Image";

export default function NewsCarousel({ news = [] }) {

    const navigate = useNavigate();

    if (!news.length) return null;

    return (
        <Box sx={{ mb: 4 }}>

            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                style={{ borderRadius: 16 }}
            >
                {news.map((item) => (

                    <SwiperSlide key={item.id}>

                        <Box
                            onClick={() => navigate(`/news/${item.id}`)}
                            sx={{
                                height: 280,
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 4,
                                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                                cursor: "pointer",
                                "&:hover img": {
                                    transform: "scale(1.05)"
                                }
                            }}
                        >

                            {/* IMAGE */}
                            <img
                                src={item.coverImage || DEFAULT_IMG}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "0.4s"
                                }}
                            />

                            {/* OVERLAY */}
                            <Box sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: 3,
                                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                            }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
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