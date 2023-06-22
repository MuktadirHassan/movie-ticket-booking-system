import {
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createHall, getHalls } from "../../services/api";
import { enqueueSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";

export default function HallManagement() {
  // create, update, delete halls

  const [hall_name, setHallName] = useState("");

  const { data } = useQuery(["hall"], getHalls);

  const handleSubmit = async () => {
    try {
      await createHall({ hall_name });
      enqueueSnackbar("Hall created successfully", { variant: "success" });
      setHallName("");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Container>
      <h1>Hall Management</h1>
      <Grid
        container
        spacing={2}
        maxWidth={400}
        sx={{ margin: "auto" }}
        direction="column"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Add New Hall
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Hall Name"
            value={hall_name}
            onChange={(e) => setHallName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hall ID</TableCell>
            <TableCell>Hall Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.halls.map((hall) => (
            <TableRow key={hall.hall_id}>
              <TableCell>{hall.hall_id}</TableCell>
              <TableCell>{hall.hall_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
