import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function Root() {
  return (
    <>
      <BoxedAppBar />
      <Outlet />
    </>
  );
}

function BoxedAppBar() {
  const { user, logout } = useAuth();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            color="inherit"
            LinkComponent={Link}
            to="/"
            sx={{ flexGrow: 0 }}
          >
            Home
          </Button>

          {user && (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
          {!user && (
            <Button color="inherit" LinkComponent={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
