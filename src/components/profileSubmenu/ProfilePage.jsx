import { Box, Grid } from '@mui/material';
import UserProfile from './UserProfile';
import UserDashboard from './UserDashboard';
import OrderRecords from '../order/OrderRecords.jsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * ProfilePage component to display the user profile page
 * Includes the user profile and the user dashboard
 * @returns {JSX.Element}
 */
const ProfilePage = () => {
  const userId = useSelector((state) => state.users.loggedInUser?.id);
  const [showOrders, setShowOrders] = useState(false);

  const handleShowOrders = () => {
    setShowOrders(!showOrders);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <UserProfile />
        </Grid>
        <Grid item xs={12} md={8}>
          {!showOrders ? (
            <UserDashboard onShowOrders={handleShowOrders} />
          ) : (
            <OrderRecords userId={userId} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
