import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
        Genres
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label="All"
          onClick={() => onSelect(null)}
          color={!selectedGenre ? "primary" : "default"}
          sx={{
            "&:hover": { opacity: 0.8 },
            transition: "all 0.2s",
          }}
        />
        {genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            onClick={() => onSelect(genre.id)}
            color={selectedGenre === genre.id ? "primary" : "default"}
            sx={{
              "&:hover": { opacity: 0.8 },
              transition: "all 0.2s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GenreFilter;
