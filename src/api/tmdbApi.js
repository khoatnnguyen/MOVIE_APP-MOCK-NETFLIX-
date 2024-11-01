import { tmdbAxios } from "./axios";

const tmdbApi = {
  // Auth endpoints
  getRequestToken: () => {
    return tmdbAxios.get("/authentication/token/new");
  },

  validateWithLogin: (username, password, requestToken) => {
    return tmdbAxios.post("/authentication/token/validate_with_login", {
      username,
      password,
      request_token: requestToken,
    });
  },

  createSession: (requestToken) => {
    return tmdbAxios.post("/authentication/session/new", {
      request_token: requestToken,
    });
  },

  deleteSession: (sessionId) => {
    return tmdbAxios.delete("/authentication/session", {
      data: { session_id: sessionId },
    });
  },

  // Movie endpoints
  getPopularMovies: (page = 1) => {
    return tmdbAxios.get("/movie/popular", { params: { page } });
  },

  getTopRatedMovies: (page = 1) => {
    return tmdbAxios.get("/movie/top_rated", { params: { page } });
  },

  getMovieDetails: (movieId) => {
    return tmdbAxios.get(`/movie/${movieId}`);
  },

  getMovieCredits: (movieId) => {
    return tmdbAxios.get(`/movie/${movieId}/credits`);
  },

  getMovieVideos: (movieId) => {
    return tmdbAxios.get(`/movie/${movieId}/videos`);
  },

  getRecommendations: (movieId) => {
    return tmdbAxios.get(`/movie/${movieId}/recommendations`);
  },

  searchMovies: (query, page = 1) => {
    return tmdbAxios.get("/search/movie", {
      params: { query, page },
    });
  },

  getGenres: () => {
    return tmdbAxios.get("/genre/movie/list");
  },

  // Account endpoints
  getAccountDetails: (sessionId) => {
    return tmdbAxios.get("/account", {
      params: { session_id: sessionId },
    });
  },

  getFavoriteMovies: (accountId, sessionId, page = 1) => {
    return tmdbAxios.get(`/account/${accountId}/favorite/movies`, {
      params: { session_id: sessionId, page },
    });
  },

  toggleFavorite: (accountId, sessionId, movieId, favorite) => {
    return tmdbAxios.post(
      `/account/${accountId}/favorite`,
      {
        media_type: "movie",
        media_id: movieId,
        favorite,
      },
      {
        params: { session_id: sessionId },
      }
    );
  },
  //Rating Endpoints
  getRatedMovies: (accountId, sessionId, page = 1) => {
    return tmdbAxios.get(`/account/${accountId}/rated/movies`, {
      params: { session_id: sessionId, page },
    });
  },

  rateMovie: (movieId, rating, sessionId) => {
    return tmdbAxios.post(
      `/movie/${movieId}/rating`,
      {
        value: rating,
      },
      {
        params: { session_id: sessionId },
      }
    );
  },

  deleteRating: (movieId, sessionId) => {
    return tmdbAxios.delete(`/movie/${movieId}/rating`, {
      params: { session_id: sessionId },
    });
  },

  // Get movie lists
  getNowPlaying: (page = 1) => {
    return tmdbAxios.get("/movie/now_playing", { params: { page } });
  },

  getUpcoming: (page = 1) => {
    return tmdbAxios.get("/movie/upcoming", { params: { page } });
  },

  getTrending: (timeWindow = "week", page = 1) => {
    return tmdbAxios.get(`/trending/movie/${timeWindow}`, { params: { page } });
  },

  // Get movie reviews
  getMovieReviews: (movieId, page = 1) => {
    return tmdbAxios.get(`/movie/${movieId}/reviews`, { params: { page } });
  },
};

export default tmdbApi;
