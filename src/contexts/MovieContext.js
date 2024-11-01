import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import tmdbApi from "../api/tmdbApi";
import { useAuth } from "./AuthContext";

const MovieContext = createContext(null);

export const MovieProvider = ({ children }) => {
  const { auth } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tmdbApi.getFavoriteMovies(
        auth.accountId,
        auth.sessionId
      );
      setFavorites(data.results);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [auth?.accountId, auth?.sessionId]);

  useEffect(() => {
    if (auth?.sessionId && auth?.accountId) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [auth?.sessionId, auth?.accountId, loadFavorites]);

  const toggleFavorite = async (movie) => {
    if (!auth?.sessionId || !auth?.accountId) {
      throw new Error("Must be logged in to manage favorites");
    }

    try {
      setLoading(true);
      const isFavorite = favorites.some((f) => f.id === movie.id);

      await tmdbApi.toggleFavorite(
        auth.accountId,
        auth.sessionId,
        movie.id,
        !isFavorite
      );

      // Update local state optimistically
      if (isFavorite) {
        setFavorites((curr) => curr.filter((f) => f.id !== movie.id));
      } else {
        setFavorites((curr) => [...curr, movie]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      loadFavorites(); // Reload on error to ensure consistency
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        loading,
        toggleFavorite,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
