import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Rating,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const MovieReviews = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);

  if (!reviews?.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          No reviews available for this movie yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
        Reviews
      </Typography>

      <AnimatePresence>
        {reviews.slice(0, visibleReviews).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </AnimatePresence>

      {reviews.length > visibleReviews && (
        <Button
          onClick={() => setVisibleReviews((prev) => prev + 3)}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Load More Reviews
        </Button>
      )}
    </Box>
  );
};

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        mb: 2,
        bgcolor: "background.paper",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Avatar
            src={
              review.author_details.avatar_path?.startsWith("/http")
                ? review.author_details.avatar_path.slice(1)
                : `https://image.tmdb.org/t/p/w100${review.author_details.avatar_path}`
            }
          >
            {review.author[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.author}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {review.author_details.rating && (
                <Rating
                  value={review.author_details.rating / 2}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              )}
              <Typography variant="body2" color="text.secondary">
                {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Collapse in={expanded} collapsedSize={isMobile ? 80 : 100}>
          <Typography variant="body2">{review.content}</Typography>
        </Collapse>

        {review.content.length > 300 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            startIcon={
              expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            sx={{ mt: 1 }}
            size="small"
          >
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieReviews;
