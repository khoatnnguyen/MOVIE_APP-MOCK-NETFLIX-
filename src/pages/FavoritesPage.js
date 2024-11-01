import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MovieGrid from "../components/movies/MovieGrid";
import { useMovies } from "../contexts/MovieContext";
import { Loading } from "../components/ui/Loading";

const FavoritesPage = () => {
  const { favorites, loading } = useMovies();
  const navigate = useNavigate();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minHeight: "100vh",
        pt: { xs: 8, sm: 9 },
        pb: 4,
        bgcolor: "#141414",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
          }}
        >
          My Favorites
        </Typography>

        {loading ? (
          <Loading />
        ) : favorites.length > 0 ? (
          <MovieGrid movies={favorites} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              align="center"
            >
              Your favorites list is empty
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Discover Movies
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage;
