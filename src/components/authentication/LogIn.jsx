import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUserAction,
  resendVerificationEmail,
  recoverUser,
} from '../../redux/usersReducer';

/**
 * Login component
 * Displays login form
 * @param {Function} onClose - close handler
 * @returns {JSX.Element}
 * */
const Login = ({ onClose = () => {} }) => {
  const [logInUser, setLogInUser] = useState({
    email: '',
    password: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [recoverAccountDialogOpen, setRecoverAccountDialogOpen] =
    useState(false);
  const [userIdToRecover, setUserIdToRecover] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const dispatch = useDispatch();
  const loginStatus = useSelector((state) => state.users.loginStatus);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogInUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const { email, password } = logInUser;
    if (!email || !password) {
      alert('All fields are required!');
      return;
    }
    try {
      const logInStatus = await dispatch(loginUserAction(logInUser)).unwrap();
      if (logInStatus.isArchived) {
        setUserIdToRecover(logInStatus.id);
        setRecoverAccountDialogOpen(true);
      } else {
        setSuccessDialogOpen(true);
        setTimeout(() => {
          setSuccessDialogOpen(false);
          setTimeout(onClose, 500);
        }, 2000);
      }
    } catch (error) {
      if (error.message === 'Email not verified') {
        setResendEmail(email);
        setDialogOpen(true);
      } else {
        setSnackbarMessage(error.message || 'Login failed');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRecoverAccountDialogClose = () => {
    setRecoverAccountDialogOpen(false);
  };

  const handleResendVerification = () => {
    dispatch(resendVerificationEmail(resendEmail))
      .unwrap()
      .then(() => {
        setSnackbarMessage('Verification email resent!');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(
          error.message || 'Failed to resend verification email',
        );
        setSnackbarOpen(true);
      });
    setDialogOpen(false);
  };

  const handleRecoverUser = () => {
    dispatch(recoverUser(userIdToRecover))
      .unwrap()
      .then(() => {
        setSnackbarMessage('Account recovered successfully!');
        setSnackbarOpen(true);
        setRecoverAccountDialogOpen(false);
      })
      .catch((error) => {
        setSnackbarMessage(error.message || 'Failed to recover account');
        setSnackbarOpen(true);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome!
        </Typography>
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={logInUser.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={logInUser.password}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loginStatus === 'loading'}
        >
          Log in
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        {recoverAccountDialogOpen || successDialogOpen ? (
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        )}
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        TransitionComponent={Fade}
        transitionDuration={500}
      >
        <DialogTitle>Email Not Verified</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your email is not verified. Please check your inbox or click the
            button below to resend the verification email.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResendVerification} color="primary">
            Resend Email
          </Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={recoverAccountDialogOpen}
        onClose={handleRecoverAccountDialogClose}
        TransitionComponent={Fade}
        transitionDuration={500}
      >
        <DialogTitle>Account Archived</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your account is archived. Do you want to recover it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRecoverUser} color="primary">
            Recover Account
          </Button>
          <Button onClick={handleRecoverAccountDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        TransitionComponent={Fade}
        transitionDuration={500}
      >
        <DialogTitle>Login Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are logged in. This dialog will close in 2 seconds.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;
