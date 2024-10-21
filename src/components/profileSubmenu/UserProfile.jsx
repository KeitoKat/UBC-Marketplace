import { useSelector } from 'react-redux';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * UserProfile component is the left part of the profile page
 * @returns {JSX.Element}
 */
const UserProfile = () => {
  let userName = 'FNAME LNAME';
  let userEmail = 'user@gmail.com';
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);

  if (loggedInUser) {
    userName = loggedInUser.name;
    userEmail = loggedInUser.email;
  }

  const handleEditProfile = () => {
    navigate(`/edit-user/${loggedInUser.id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <Avatar sx={{ width: 100, height: 100, mb: 2 }}>{userName}</Avatar>
      <Typography variant="h5" align="center">
        {userName}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" align="center">
        {userEmail}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 4, bgcolor: 'orange' }}
        onClick={handleEditProfile}
      >
        Edit profile
      </Button>
    </Box>
  );
};

export default UserProfile;
