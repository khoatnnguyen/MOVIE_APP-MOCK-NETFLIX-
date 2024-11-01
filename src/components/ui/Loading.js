import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      width: "100%",
    }}
  >
    <CircularProgress size={40} sx={{ color: "primary.main" }} />
  </Box>
);
