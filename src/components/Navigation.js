import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={{ background: "rgba(0, 0, 0, 0.9)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "primary.main",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            Movie
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              Movies
            </Button>

            <Button
              component={RouterLink}
              to="/favorites"
              color="inherit"
              startIcon={!isMobile && <Heart />}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              Favorites
            </Button>

            {auth ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    ml: 1,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {auth.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem disabled sx={{ opacity: 0.7 }}>
                    {auth.username}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={16} style={{ marginRight: 8 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
