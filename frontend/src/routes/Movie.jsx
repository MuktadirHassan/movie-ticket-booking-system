import {
  Button,
  Container,
  Grid,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getMovie, getShowSeats } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { FormatDate } from "../utils/formatDate";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

export default function Movie() {
  const { movieId } = useParams();
  const { data, isError, isLoading } = useQuery(["movie", movieId], () =>
    getMovie(movieId)
  );

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
    <Container
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
    </Container>
  );
};

const MovieShowtimes = ({ shows }) => {
  const [selectedShow, setSelectedShow] = useState(shows[0]);
  const [seats, setSeats] = useState({
    seats: [
      {
        seat_number: 1,
        seat_id: 65,
        available: true,
      },
    ],
  });
  const [bookedSeats, setBookedSeats] = useState([]);

  const { isLoading } = useQuery(
    ["show", selectedShow.show_id],
    () =>
      getShowSeats({
        showId: selectedShow.show_id,
        hallId: selectedShow.hall_id,
      }),
    {
      onSuccess: (data) => {
        setSeats(data);
      },
    }
  );

  const handleSeatToggle = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      setBookedSeats(bookedSeats.filter((seat) => seat !== seatId));
      return;
    }
    if (bookedSeats.length === 8) {
      enqueueSnackbar("You can only book 8 seats at a time", {
        variant: "error",
      });
      return;
    }
    setBookedSeats([...bookedSeats, seatId]);
  };

  const handleShowChange = (event, newValue) => {
    setBookedSeats([]); // Reset booked seats
    setSelectedShow(newValue);
  };

  if (!shows) {
    return <div>No showtimes available</div>;
  }

  return (
    <Container>
      <Tabs value={selectedShow} onChange={handleShowChange} centered>
        {shows.map((show) => {
          return (
            <Tab
              key={show.show_id}
              label={
                FormatDate(show.show_date) +
                " " +
                show.show_time +
                " " +
                [show.hall_name]
              }
              value={show}
            />
          );
        })}
      </Tabs>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={500} />
      ) : (
        <SeatFormation
          data={seats}
          handleSeatToggle={handleSeatToggle}
          bookedSeats={bookedSeats}
        />
      )}

      <Button variant="contained" fullWidth>
        Book
      </Button>
    </Container>
  );
};

const SeatFormation = ({ data, handleSeatToggle, bookedSeats }) => {
  /**
   * Seats: [{
   *  seat_number: 1,
   *  seat_id: 1,
   *  available: true | false
   * }]
   */
  const { seats } = data;

  // Grid of 10x10
  return (
    <Grid container spacing={1} rowSpacing={2} my={2} alignContent={"center"}>
      {seats.map((seat) => {
        return (
          <Grid item xs={1} key={seat.seat_id}>
            <Button
              fullWidth
              variant={
                bookedSeats.includes(seat.seat_id) ? "contained" : "outlined"
              }
              disabled={!seat.available}
              onClick={() => handleSeatToggle(seat.seat_id)}
            >
              {seat.seat_number}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};
