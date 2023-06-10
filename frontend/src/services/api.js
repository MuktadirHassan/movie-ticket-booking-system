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
