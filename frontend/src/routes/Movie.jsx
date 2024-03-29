import {
  Alert,
  Button,
  Container,
  Grid,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { createBooking, getMovie, getShowSeats } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { FormatDate } from "../utils/formatDate";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../auth/Auth";

export default function Movie() {
  const { movieId } = useParams();
  const { data, isError, isLoading } = useQuery(["movie", movieId], () =>
    getMovie(movieId)
  );

  if (isError && !isLoading) {
    return <div>Something went wrong</div>;
  }
  if (isLoading) {
    return (
      <Container>
        <Skeleton variant="rectangular" width="100%" height={500} />
      </Container>
    );
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
  const auth = useAuth();
  const [seats, setSeats] = useState({
    seats: [],
  });
  const [bookedSeats, setBookedSeats] = useState([]);

  const { isLoading, refetch } = useQuery(
    ["show", selectedShow?.show_id],
    () =>
      getShowSeats({
        showId: selectedShow.show_id,
        hallId: selectedShow.hall_id,
      }),
    {
      onSuccess: (data) => {
        setSeats(data);
      },
      enabled: !!selectedShow?.show_id && !!selectedShow?.hall_id,
    }
  );

  if (!auth.user) {
    return <Alert>Please login to book tickets</Alert>;
  }

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

  const handleBooking = async () => {
    const show_id = selectedShow.show_id;
    const amount_paid = selectedShow.amount * bookedSeats.length;

    if (bookedSeats.length === 0) {
      enqueueSnackbar("Please select seats", {
        variant: "error",
      });
      return;
    }

    try {
      await createBooking({
        show_id,
        amount_paid,
        seat_ids: bookedSeats,
      });

      refetch();
      setBookedSeats([]);
      enqueueSnackbar("Booking successful", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (shows?.length === 0) {
    return <div>No showtimes available</div>;
  }
  return (
    <Container>
      <Tabs
        value={selectedShow}
        onChange={handleShowChange}
        centered
        visibleScrollbar
      >
        {shows.map((show) => {
          return (
            <Tab
              key={show.show_id}
              label={
                FormatDate(show.show_date) +
                " at " +
                show.show_time +
                " in Hall: " +
                [show.hall_name] +
                " - Price: " +
                show.amount +
                " BDT"
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

      <Button variant="contained" fullWidth onClick={handleBooking}>
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
