import { Container, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getMovie } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { FormatDate } from "../utils/formatDate";

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
      }}
    >
      <Typography variant="h4">{movie.movie_name}</Typography>
      <Typography variant="body">{movie.description}</Typography>
      <Typography variant="body">{movie.duration} minutes</Typography>
      <Typography variant="body">{FormatDate(movie.release_date)}</Typography>
    </Paper>
  );
};

const MovieShowtimes = ({ shows }) => {
  if (!shows) {
    return <div>No showtimes available</div>;
  }

  return (
    <div>
      {shows.map((show) => {
        return <div key={show.show_id}>{FormatDate(show.show_date)}</div>;
      })}
    </div>
  );
};
