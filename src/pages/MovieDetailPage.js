// src/pages/MovieDetailPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid2,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import tmdbApi from "../api/tmdbApi";
import { Loading } from "../components/ui/Loading";
import MovieRating from "../components/movies/MovieRating";
import MovieReviews from "../components/movies/MovieReviews";
import MovieCarousel from "../components/movies/MovieCarousel"; // Import MovieCarousel

const MovieDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // Add recommendations state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const [movieData, reviewsData, recommendationsData] = await Promise.all([
        tmdbApi.getMovieDetails(id),
        tmdbApi.getMovieReviews(id),
        tmdbApi.getRecommendations(id), // Add recommendations API call
      ]);

      setMovie(movieData.data);
      setReviews(reviewsData.data.results);
      setRecommendations(recommendationsData.data.results);
    } catch (error) {
      console.error("Failed to load movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!movie) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minHeight: "100vh",
        bgcolor: "#141414",
        pt: { xs: 8, sm: 9 },
      }}
    >
      {/* Backdrop Image */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", md: "70vh" },
          width: "100%",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)",
          },
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          mt: -20,
          position: "relative",
          zIndex: 1,
          pb: 4,
        }}
      >
        {/* Movie Details */}
        <Grid2 container spacing={4}>
          <Grid2 item xs={12} md={3}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </Grid2>

          <Grid2 item xs={12} md={9}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <MovieRating movieId={movie.id} />
            </Box>

            <Box sx={{ mb: 3 }}>
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>

            <Typography variant="h6" gutterBottom color="primary">
              Overview
            </Typography>
            <Typography paragraph>{movie.overview}</Typography>

            <Grid2 container spacing={3}>
              <Grid2 item xs={6} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Release Date
                </Typography>
                <Typography>{movie.release_date}</Typography>
              </Grid2>
              <Grid2 item xs={6} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Runtime
                </Typography>
                <Typography>{movie.runtime} minutes</Typography>
              </Grid2>
              <Grid2 item xs={6} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Rating
                </Typography>
                <Typography>★ {movie.vote_average?.toFixed(1)}/10</Typography>
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <Grid2 item xs={12}>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 3,
                  }}
                >
                  You May Also Like
                </Typography>
                <MovieCarousel
                  movies={recommendations}
                  compact // Use compact mode for recommendations
                />
              </Box>
            </Grid2>
          )}

          {/* Reviews Section */}
          <Grid2 item xs={12}>
            <Divider sx={{ my: 4 }} />
            <MovieReviews reviews={reviews} />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default MovieDetailPage;
