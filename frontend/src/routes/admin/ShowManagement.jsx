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
import { createShow, getShows } from "../../services/api";
import { enqueueSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { FormatDate } from "../../utils/formatDate";

export default function ShowManagement() {
  // create, update, delete shows

  const [movie_id, setMovieId] = useState("");
  const [hall_id, setHallId] = useState("");
  const [show_time, setShowTime] = useState("");
  const [show_date, setShowDate] = useState("");
  const [amount, setAmount] = useState("");

  const { data } = useQuery(["show"], getShows);

  const handleSubmit = async () => {
    try {
      await createShow({
        movie_id: Number(movie_id),
        hall_id: Number(hall_id),
        show_time,
        show_date,
        amount: Number(amount),
      });
      setMovieId("");
      setHallId("");
      setShowTime("");
      setShowDate("");
      setAmount("");
      enqueueSnackbar("Show created successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Container>
      <h1>Show Management</h1>
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
            Add New Show
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Movie ID"
            value={movie_id}
            onChange={(e) => setMovieId(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Hall ID"
            value={hall_id}
            onChange={(e) => setHallId(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            type="time"
            label="Show Time"
            value={show_time}
            onChange={(e) => setShowTime(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            type="date"
            label="Show Date"
            value={show_date}
            onChange={(e) => setShowDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            <TableCell>Movie ID</TableCell>
            <TableCell>Hall ID</TableCell>
            <TableCell>Show Time</TableCell>
            <TableCell>Show Date</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.shows.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.movie_id}</TableCell>
              <TableCell>{row.hall_id}</TableCell>
              <TableCell>{row.show_time}</TableCell>
              <TableCell>{FormatDate(row.show_date)}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
