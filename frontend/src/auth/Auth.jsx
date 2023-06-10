import { createContext, useContext, useState } from "react";
import { getUser, userLogout } from "../services/api";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const AuthContext = createContext();

const LOCAL_STORAGE_KEY = "auth";

export function updateLocalStorage(user) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
}

export function getLocalStorage() {
  const user = localStorage.getItem(LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

export function clearLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getLocalStorage());

  const updateUser = (user) => {
    updateLocalStorage(user);
    setUser(user);
  };

  const { isLoading } = useQuery(["user"], getUser, {
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => updateUser(data),
    onError: () => {
      clearLocalStorage();
      setUser(null);
    },
  });

  const logout = async () => {
    await userLogout();
    clearLocalStorage();
    setUser(null);
    enqueueSnackbar("Logged out successfully", { variant: "success" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        loading: isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function PrivateRoute({ children }) {
  let auth = useAuth();
  const localUser = getLocalStorage();

  // localuser is null and auth is loading
  if (!localUser && !auth.loading) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export { PrivateRoute };
