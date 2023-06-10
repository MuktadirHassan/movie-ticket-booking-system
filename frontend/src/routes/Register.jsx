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
  userSignup,
} from "../services/api";
import { useAuth } from "../auth/Auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();
  const { updateUser } = useAuth();

  const randomFillInput = () => {
    const randomString = Math.random().toString(36).substring(2);
    setUsername(randomString);
    setEmail(
      `${randomString}@${Math.random()
        .toString(36)
        .substring(2)
        .substring(0, 5)}.com`
    );
    setPhone_number(Math.random().toString().substring(2, 13));
    setPassword(Math.random().toString(36).substring(2));
  };

  const { mutate: register, isLoading } = useMutation(
    (userData) => userSignup(userData),
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
    // Validate the input
    switch (true) {
      case !username:
        setError("Username is required");
        return;
      case !email:
        setError("Email is required");
        return;
      case RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ).test(email) === false:
        setError("Email is invalid");
        return;
      case !phone_number:
        setError("Phone Number is required");
        return;
      case !RegExp(/^[0-9]{11}$/).test(phone_number):
        setError("Phone Number is invalid");
        return;
      case !password:
        setError("Password is required");
        return;
      default:
        setError(null);
    }

    const userData = {
      username,
      email,
      phone_number,
      password,
    };

    register(userData);
    // Submit the form
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
            Register
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Phone Number"
            value={phone_number}
            onChange={(e) => setPhone_number(e.target.value)}
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
            Register
          </Button>
          <Button fullWidth onClick={randomFillInput}>
            Random Fill
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
