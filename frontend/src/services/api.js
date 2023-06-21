import axios from "axios";
import { enqueueSnackbar } from "notistack";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 4000,
  withCredentials: true,
});

export function successResponseHandler(response) {
  enqueueSnackbar(response?.message, {
    variant: "success",
  });
}

export function errorResponseHandler(error) {
  enqueueSnackbar(error?.response?.data?.error || error?.message, {
    variant: "error",
  });
}

export const userSignup = async (user) => {
  const response = await api.post("/register", user);
  return response.data;
};

export const userLogin = async (user) => {
  const response = await api.post("/login", user);
  return response.data;
};

export const userLogout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const getMovies = async () => {
  const response = await api.get("/movies");
  return response.data;
};

export const getMovie = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movie) => {
  const response = await api.post("/movies", movie);
  return response.data;
};

export const updateMovie = async (id, movie) => {
  const response = await api.put(`/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
};

export const createHall = async (hall) => {
  const response = await api.post("/halls/create", hall);
  return response.data;
};

export const getHalls = async () => {
  const response = await api.get("/halls");
  return response.data;
};

export const getHall = async (id) => {
  const response = await api.get(`/halls/${id}`);
  return response.data;
};

export const createShow = async (show) => {
  const response = await api.post("/shows/create", show);
  return response.data;
};

export const getShows = async () => {
  const response = await api.get("/shows");
  return response.data;
};

export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const getShowSeats = async ({ showId, hallId }) => {
  const url = `/shows/seats?hallId=${hallId}&showId=${showId}`;
  const response = await api.get(url);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/my-bookings");
  return response.data;
};
