// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import tmdbApi from "../api/tmdbApi";
import MovieGrid from "../components/movies/MovieGrid";
import MovieCarousel from "../components/movies/MovieCarousel";
import GenreFilter from "../components/movies/GenreFilter";
import { Loading } from "../components/ui/Loading";
import { useDebounce } from "../hooks/useDebounce";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";
  const genreId = searchParams.get("genre") || "";

  const debouncedSearch = useDebounce(query, 500);

  useEffect(() => {
    loadGenres();
    loadTopRated();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [page, debouncedSearch, genreId]);

  const loadGenres = async () => {
    try {
      const { data } = await tmdbApi.getGenres();
      setGenres(data.genres);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  };

  const loadTopRated = async () => {
    try {
      const { data } = await tmdbApi.getTopRated();
      setTopRated(data.results);
    } catch (error) {
      console.error("Failed to load top rated movies:", error);
    }
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      let response;

      if (debouncedSearch) {
        response = await tmdbApi.searchMovies(debouncedSearch, page);
      } else if (genreId) {
        response = await tmdbApi.getMoviesByGenre(genreId, page);
      } else {
        response = await tmdbApi.getPopularMovies(page);
      }

      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500));
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const newQuery = event.target.value;
    setSearchParams((params) => {
      if (newQuery) {
        params.set("query", newQuery);
      } else {
        params.delete("query");
      }
      params.set("page", "1");
      return params;
    });
  };

  const handleGenreSelect = (genreId) => {
    setSearchParams((params) => {
      if (genreId) {
        params.set("genre", genreId);
      } else {
        params.delete("genre");
      }
      params.set("page", "1");
      params.delete("query");
      return params;
    });
  };

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
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
        }}
      >
        {!query && !genreId && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: "#e50914",
                fontWeight: "bold",
                mb: 3,
                pl: { xs: 1, sm: 2 },
              }}
            >
              Top Rated Movies
            </Typography>
            <MovieCarousel movies={topRated} />
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search movies..."
            value={query}
            onChange={handleSearch}
            sx={{
              maxWidth: 600,
              mx: "auto",
              display: "block",
              mb: 4,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255, 255, 255, 0.05)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <GenreFilter
            genres={genres}
            selectedGenre={genreId}
            onSelect={handleGenreSelect}
          />
        </Box>

        {loading ? (
          <Loading />
        ) : (
          <>
            <MovieGrid movies={movies} />
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setSearchParams((params) => {
                      params.set("page", value.toString());
                      return params;
                    });
                  }}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
