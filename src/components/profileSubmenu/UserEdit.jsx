import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  FormControl,
} from '@mui/material';

import { editUser } from '../../redux/usersReducer';
import SnackbarNotif from '../postItem/SnackbarNotif';

/**
 * UserEdit component to edit user information
 * Handles user information update
 * @returns {JSX.Element}
 */
const UserEdit = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name);
      setMobile(loggedInUser.mobile);
    }
  }, [loggedInUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      _id: loggedInUser._id || loggedInUser.id,
      name,
      mobile,
    };

    try {
      if (password) {
        await dispatch(editUser({ ...updatedUser, password })).unwrap();
        setSnackbarMessage('Your information updated!');
      } else {
        await dispatch(editUser(updatedUser)).unwrap();
        setSnackbarMessage('Your information updated!');
      }
      localStorage.setItem('userName', updatedUser.name);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update your information.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Box
        component="form"
        sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
        onSubmit={handleSubmit}
      >
        <Stack
          spacing={2}
          direction="column"
          sx={{ width: '50ch' }}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">Edit your information:</Typography>

          <FormControl noValidate autoComplete="off" required fullWidth>
            <TextField
              label="Name*"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl noValidate autoComplete="off" required fullWidth>
            <TextField
              label="Mobile*"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl noValidate autoComplete="off" fullWidth>
            <TextField
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <Button variant="contained" size="large" fullWidth type="submit">
            Update
          </Button>
        </Stack>
      </Box>

      <SnackbarNotif
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        onCloseSnackbar={handleCloseSnackbar}
      />
    </>
  );
};

export default UserEdit;
