import { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import {
  errorResponseHandler,
  successResponseHandler,
  userLogin,
} from "../services/api";
import { useAuth } from "../auth/Auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useAuth();
  let navigate = useNavigate();
  let location = useLocation();

  const { mutate: login, isLoading } = useMutation(
    (userData) => userLogin(userData),
    {
      onSuccess: (data) => {
        successResponseHandler(data);
        navigate(location.state?.from || "/");
        updateUser(data.user);
      },
      onError: (error) => errorResponseHandler(error),
    }
  );

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    switch (true) {
      case !email:
        setError("Email is required");
        return;
      case RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ).test(email) === false:
        setError("Email is invalid");
        return;
      case !password:
        setError("Password is required");
        return;
      default:
        setError(null);
    }
    login({ email, password });
  };

  return (
    <Container>
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
            Login
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error" align="center">
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
