import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";

const MovieCarousel = ({ title, movies }) => {
  const theme = useTheme();
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          px: 2,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={scrollRef}
          component={motion.div}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            px: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& > *": {
              flex: "0 0 auto",
              width: {
                xs: "85%",
                sm: "45%",
                md: "30%",
                lg: "22%",
              },
            },
          }}
        >
          {movies.map((movie) => (
            <Box key={movie.id} sx={{ height: "100%" }}>
              <MovieCard movie={movie} compact />
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MovieCarousel;
