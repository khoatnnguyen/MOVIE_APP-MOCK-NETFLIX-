import React, { useState } from "react";
import {
  Box,
  Rating,
  Typography,
  Popover,
  Button,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Star, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import tmdbApi from "../../api/tmdbApi";

const MovieRating = ({ movieId, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempRating, setTempRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const { auth } = useAuth();

  const handleRatingClick = (event) => {
    if (auth) {
      setAnchorEl(event.currentTarget);
    } else {
      setSnackbar({
        open: true,
        message: "Please login to rate movies",
      });
    }
  };

  const handleRatingChange = async (newValue) => {
    try {
      if (newValue === null) {
        await tmdbApi.deleteRating(movieId, auth.sessionId);
        setRating(0);
      } else {
        await tmdbApi.rateMovie(movieId, newValue * 2, auth.sessionId);
        setRating(newValue);
      }
      setAnchorEl(null);
      setSnackbar({
        open: true,
        message: newValue === null ? "Rating removed" : "Rating updated",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update rating",
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={handleRatingClick}>
          <Star fill={rating > 0 ? "currentColor" : "none"} />
        </IconButton>
        {rating > 0 && (
          <Typography variant="body2">
            Your rating: {rating.toFixed(1)}
          </Typography>
        )}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography>Rate this movie</Typography>
            <IconButton size="small" onClick={() => setAnchorEl(null)}>
              <X size={16} />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Rating
              value={tempRating || rating}
              precision={0.5}
              onChange={(_, value) => setTempRating(value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              {rating > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRatingChange(null)}
                >
                  Remove Rating
                </Button>
              )}
              <Button
                variant="contained"
                size="small"
                onClick={() => handleRatingChange(tempRating)}
                disabled={!tempRating}
              >
                Rate
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
};

export default MovieRating;
