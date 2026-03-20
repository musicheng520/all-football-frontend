import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function NewsCarousel({ news = [] }) {

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

                        <Box sx={{
                            height: 280,
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 4,
                            boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                        }}>

                            {/* IMAGE */}
                            <img
                                src={item.cover}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
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