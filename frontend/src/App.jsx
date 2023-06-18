import { lazy } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { SnackbarProvider } from "notistack";
import { AuthProvider, PrivateRoute } from "./auth/Auth";
import Movies from "./components/MoviesArea";
import Movie from "./routes/Movie";

const Root = lazy(() => import("./routes/Root"));
const Login = lazy(() => import("./routes/Login"));
const Register = lazy(() => import("./routes/Register"));

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: "#f44336",
    },
    secondary: {
      main: "#3f51b5",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "/",
        element: <Movies />,
        errorElement: <div>Something went wrong</div>,
      },
      {
        path: "movies/:movieId",
        element: <Movie />,
      },
      {
        path: "bookings",
        element: (
          <PrivateRoute>
            <div>Bookings</div>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <Suspense fallback={<div></div>}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </Suspense>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
