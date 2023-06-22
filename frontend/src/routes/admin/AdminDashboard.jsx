import { Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <SideBar />
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;

const SideBar = () => {
  return (
    <>
      <Paper
        sx={{
          width: 240,
          top: 80,
          padding: 2,
          borderRadius: 0,
          height: "calc(100vh - 65px)",
        }}
      >
        <List>
          <ListItem component={Link} to="/admin/users">
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem component={Link} to="/admin/halls">
            <ListItemText primary="Halls" />
          </ListItem>
          <ListItem component={Link} to="/admin/movies">
            <ListItemText primary="Movies" />
          </ListItem>
          <ListItem component={Link} to="/admin/shows">
            <ListItemText primary="Shows" />
          </ListItem>
          <ListItem component={Link} to="/admin/bookings">
            <ListItemText primary="Bookings" />
          </ListItem>
        </List>
      </Paper>
    </>
  );
};
