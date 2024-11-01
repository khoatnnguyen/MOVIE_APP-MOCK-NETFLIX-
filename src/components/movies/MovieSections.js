import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import MovieCarousel from "./MovieCarousel";
import { isMobile } from "react-device-detect";

const MovieSection = ({ title, movies, loading }) => {
  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Skeleton width={200} height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={isMobile ? "85%" : "250px"}
              height={350}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ mb: 4 }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          px: { xs: 2, sm: 3 },
        }}
      >
        {title}
      </Typography>
      <MovieCarousel movies={movies} />
    </Box>
  );
};

export default MovieSection;
