import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Container, Grid } from "@mui/material";

export default function Movies() {
  return (
    <Container
      sx={{
        paddingTop: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <MovieCard />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MovieCard />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MovieCard />
        </Grid>
      </Grid>
    </Container>
  );
}

const MovieCard = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
