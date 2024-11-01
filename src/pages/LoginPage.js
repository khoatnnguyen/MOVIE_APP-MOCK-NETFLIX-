import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #000000, #434343)",
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          bgcolor: "rgba(18, 18, 18, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "primary.main",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Movie App
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("username")}
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
              },
            }}
          />

          <TextField
            {...register("password")}
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              height: 48,
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Use your TMDB account to login
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
