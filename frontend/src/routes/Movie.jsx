import { Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getMovie } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { FormatDate } from "../utils/formatDate";
import { useState } from "react";

export default function Movie() {
  const { movieId } = useParams();
  const { data, isError, isLoading } = useQuery(["movie", movieId], () =>
    getMovie(movieId)
  );

  console.log(data);

  if (isError && !isLoading) {
    return <div>Something went wrong</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Container
      sx={{
        paddingTop: 2,
      }}
    >
      <MovieDetails movie={data.movie} />
      <MovieShowtimes shows={data.shows} />
    </Container>
  );
}

const MovieDetails = ({ movie }) => {
  return (
    <Paper
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
      elevation={3}
    >
      <Typography variant="h4">{movie.movie_name}</Typography>
      <Typography variant="body2">{FormatDate(movie.release_date)}</Typography>
      <Typography variant="body2">{movie.duration} minutes</Typography>
      <Typography variant="body">{movie.description}</Typography>
    </Paper>
  );
};

const MovieShowtimes = ({ shows }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!shows) {
    return <div>No showtimes available</div>;
  }

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered>
        {shows.map((show) => {
          return (
            <Tab key={show.show_id} label={FormatDate(show.show_date)}>
              {FormatDate(show.show_date)}
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};
