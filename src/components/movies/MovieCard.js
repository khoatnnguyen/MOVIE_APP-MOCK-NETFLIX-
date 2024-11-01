// src/components/movies/MovieCard.js
import React, { useState } from "react";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../../contexts/MovieContext";
import { useAuth } from "../../contexts/AuthContext";
import MovieRating from "./MovieRating";

const MovieCard = ({ movie, compact = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovies();
  const { auth } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!auth) {
      navigate("/login");
      return;
    }
    await toggleFavorite(movie);
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const infoVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        onClick={() => navigate(`/movie/${movie.id}`)}
        sx={{
          height: "100%",
          position: "relative",
          cursor: "pointer",
          bgcolor: "background.paper",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          height={compact ? 250 : 400}
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          sx={{
            objectFit: "cover",
          }}
        />

        <AnimatePresence>
          {(isHovered || isMobile) && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={infoVariants}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 100%)",
                padding: theme.spacing(2),
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {movie.title}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Rating
                  value={movie.vote_average / 2}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography variant="body2">
                  ({movie.vote_average.toFixed(1)})
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 2,
                  opacity: 0.8,
                }}
              >
                {movie.overview}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${movie.id}`);
                  }}
                >
                  <Play size={16} />
                </IconButton>

                <MovieRating movieId={movie.id} />

                <IconButton
                  size="small"
                  onClick={handleFavoriteClick}
                  sx={{
                    color: isFavorite(movie.id) ? "primary.main" : "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <Heart
                    size={16}
                    fill={isFavorite(movie.id) ? "currentColor" : "none"}
                  />
                </IconButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
