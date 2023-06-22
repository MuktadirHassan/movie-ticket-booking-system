import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { createMovie } from "../../services/api";
import { enqueueSnackbar } from "notistack";

export default function MovieManagement() {
  // create, update, delete movies

  const [movie_name, setMovieName] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      await createMovie({
        movie_name,
        release_date,
        duration: Number(duration),
        description,
      });
      setMovieName("");
      setReleaseDate("");
      setDuration(0);
      setDescription("");
      enqueueSnackbar("Movie created successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Container>
      <h1>Movie Management</h1>
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
            Add New Movie
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Movie Name"
            value={movie_name}
            onChange={(e) => setMovieName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            type="date"
            label="Release Date"
            value={release_date}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
    </Container>
  );
}
