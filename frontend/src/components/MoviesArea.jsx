import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Badge,
  CardActionArea,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../services/api";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filterType, setFilterType] = useState("movie_name"); // Default filter type
  const { data, isError } = useQuery(
    ["movies", debouncedSearchQuery, filterType],
    () => getMovies(searchQuery, filterType)
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="filter-type-label">Filter Type</InputLabel>
            <Select
              labelId="filter-type-label"
              id="filter-type"
              value={filterType}
              onChange={handleFilterTypeChange}
              label="Filter Type"
            >
              <MenuItem value="movie_name">Movie Name</MenuItem>
              <MenuItem value="release_year">Release Year</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {isError ? <Typography>Something went wrong!</Typography> : null}

        {
          data?.movies?.length === 0 ? (
            <Container>
              <Typography>No movies found!</Typography>
            </Container>
          ) : null // If no movies found, display this message
        }
        {data?.movies?.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.movie_id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const MovieCard = ({ movie }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea LinkComponent={Link} to={`/movies/${movie.movie_id}`}>
        <CardMedia
          component="img"
          height="140"
          image="https://images.unsplash.com/photo-1686343916755-9b411972c06e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80"
          alt="green iguana"
        />
        <CardContent>
          <Badge>
            <Typography variant="body2" color="text.secondary">
              {movie.duration} min
            </Typography>
          </Badge>
          <Typography variant="body2" color="text.secondary">
            Released:{" "}
            {Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(movie.release_date))}
          </Typography>

          <Typography gutterBottom variant="h5" component="div">
            {movie.movie_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
