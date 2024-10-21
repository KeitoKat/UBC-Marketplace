import { Box, Grid, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, archiveUser, logoutUser } from '../../redux/usersReducer';
import { useNavigate } from 'react-router-dom';

/**
 * Settings component to display the user settings
 * Includes the delete account and archive account buttons to handle account deletion and archiving
 * @returns {JSX.Element}
 */
const Settings = () => {
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (loggedInUser) {
      const confirmed = window.confirm(
        'Are you sure you want to delete your account?',
      );
      if (confirmed) {
        try {
          await dispatch(deleteUser(loggedInUser.id)).unwrap();
          dispatch(logoutUser());
          alert('Account deleted! Bye!');
          navigate('/');
        } catch (error) {
          console.error('Failed to delete account:', error);
          alert('Failed to delete account. Please try again.');
        }
      }
    }
  };
  const handleArchiveAccount = async () => {
    if (loggedInUser) {
      const confirmed = window.confirm(
        'Are you sure you want to archive your account?',
      );
      if (confirmed) {
        try {
          await dispatch(archiveUser(loggedInUser.id)).unwrap();
          dispatch(logoutUser());
          alert('Account archived succesfully! You have been logged out.');
          navigate('/');
        } catch (error) {
          console.error('Failed to archive account:', error);
          alert('Failed to archive account. Please try again.');
        }
      }
    }
  };

  return (
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={handleArchiveAccount}
          >
            Archive Account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
