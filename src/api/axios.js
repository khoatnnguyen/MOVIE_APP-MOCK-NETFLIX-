import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "3345f8d25a0a20af9ee242cd25e37ded";

export const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});
