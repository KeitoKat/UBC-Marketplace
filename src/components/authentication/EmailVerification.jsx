import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { verifyEmailAction } from '../../redux/usersReducer';

/**
 * EmailVerification component
 * Verifies user's email using token from URL
 * Redirects to login page after verification
 * Displays loading spinner while verifying email
 * If verification fails, displays alert
 *
 * @returns {JSX.Element}
 */
const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      dispatch(verifyEmailAction(token))
        .unwrap()
        .then(() => {
          navigate('/login');
        })
        .catch(() => {
          alert('Email verification failed.');
        });
    }
  }, [location.search, dispatch, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" ml={2}>
        Verifying your email...
      </Typography>
    </Box>
  );
};

export default EmailVerification;
