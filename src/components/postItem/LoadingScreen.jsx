import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
/**
 * LoadingScreen component
 * Displays a full-screen loading screen with a message
 * @param {Object} message - The message to display
 */
const LoadingScreen = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999,
    }}
  >
    <CircularProgress color="inherit" />
    <Typography variant="h6" color="inherit" sx={{ mt: 2 }}>
      {message}
    </Typography>
  </Box>
);

export default LoadingScreen;
