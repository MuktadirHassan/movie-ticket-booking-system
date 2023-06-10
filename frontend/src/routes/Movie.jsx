import { Container } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Movie() {
  const { movieId } = useParams();
  return (
    <Container
      sx={{
        paddingTop: 2,
      }}
    >
      Movie
    </Container>
  );
}
