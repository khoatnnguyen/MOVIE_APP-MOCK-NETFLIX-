// src/components/movies/MovieGrid.js
import React from "react";
import { Grid2, Container } from "@mui/material";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";

const MovieGrid = ({ movies }) => {
  return (
    <Container maxWidth="xl" disableGutters>
      <Grid2
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)", // 2 columns on mobile
            sm: "repeat(3, 1fr)", // 3 columns on tablet
            md: "repeat(4, 1fr)", // 4 columns on desktop
            lg: "repeat(5, 1fr)", // 5 columns on larger screens
          },
          gap: 2,
          px: 2, // Add some padding on the sides
        }}
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </Grid2>
    </Container>
  );
};

export default MovieGrid;
