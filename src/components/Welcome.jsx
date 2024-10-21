import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import Signup from './authentication/SignUp';
import Login from './authentication/LogIn';
import { styled } from '@mui/material/styles';
/**
 * Welcome component to display the welcome page of the application with a carousel of images and a brief description
 * @returns {JSX.Element}
 */

// Array of background images
const backgroundImages = [
  'https://live.staticflickr.com/65535/50516411798_55a5dd9816_b.jpg',
  'https://live.staticflickr.com/266/19901880670_5dfd479ba2_z.jpg',
  'https://live.staticflickr.com/65535/53470442176_846ffebd9c_z.jpg',
  'https://live.staticflickr.com/65535/53470442176_846ffebd9c_z.jpg',
];

// Styled button component with custom styles
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  margin: theme.spacing(1),
  borderRadius: '25px',
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0px 5px 8px -2px rgba(0,0,0,0.3)',
    transform: 'translateY(-2px)',
  },
}));

// Preload images to prevent flickering when changing images in the carousel
function preloadImages(imageArray) {
  const promises = imageArray.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  return Promise.all(promises);
}

/**
 * Welcome component to display the welcome page of the application with a carousel of images and a brief description
 * @returns {JSX.Element}
 */
function Welcome() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const loggedInUser = useSelector((state) => state.users.loggedInUser);

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  useEffect(() => {
    preloadImages(backgroundImages)
      .then(() => {
        setImagesLoaded(true);
        const interval = setInterval(() => {
          setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % backgroundImages.length,
          );
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
      });
  }, []);

  // Display loading spinner while images are being loaded

  if (!imagesLoaded) {
    return (
      <Box
        sx={{
          minWidth: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box>
          <CircularProgress />
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minWidth: '100%',
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          {backgroundImages.map((image, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: '30px',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentImageIndex === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
              }}
            />
          ))}
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                mb: 2,
                animation: 'fadeInDown 1s ease-in-out',
                '@keyframes fadeInDown': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(-50px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Welcome to UBC Marketplace
              </Typography>
              <Typography variant="h5" paragraph>
                Buy, sell, and trade personal items and services within the UBC
                community.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                '& > button': {
                  width: '150px',
                },
              }}
            >
              {loggedInUser &&
              loggedInUser.message !==
                'Registration successful, please check your email to verify your account' ? (
                <StyledButton
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/items"
                  sx={{
                    backgroundColor: '#3f51b5',
                    '&:hover': {
                      backgroundColor: '#303f9f',
                    },
                  }}
                >
                  Explore
                </StyledButton>
              ) : (
                <>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handleOpenLogin}
                    sx={{
                      backgroundColor: '#3f51b5',
                      '&:hover': {
                        backgroundColor: '#303f9f',
                      },
                    }}
                  >
                    Login
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenSignup}
                    sx={{
                      borderColor: grey[500],
                      color: grey[500],
                      '&:hover': {
                        backgroundColor: 'rgba(245, 0, 87, 0.04)',
                        borderColor: '#c51162',
                        color: '#c51162',
                      },
                    }}
                  >
                    Sign Up
                  </StyledButton>
                </>
              )}
            </Box>
          </Container>
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              width: '100%',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <Typography variant="body2" color="white">
              © 2020 UBC Brand & Marketing. All rights reserved.
            </Typography>
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Discover the features of our marketplace
          </Typography>
          <Grid container spacing={4} justifyContent="center" mt={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <SellIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                <Typography variant="h6" mt={1}>
                  Sell Items
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Easily list your items for sale.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <ShoppingCartIcon
                  sx={{ fontSize: 50, color: 'primary.main' }}
                />
                <Typography variant="h6" mt={1}>
                  Buy Items
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Find great deals on a wide range of items.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <AccountCircleIcon
                  sx={{ fontSize: 50, color: 'primary.main' }}
                />
                <Typography variant="h6" mt={1}>
                  UBC Exclusive
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Exclusive marketplace for all UBC students and staff only.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Modal open={openSignup} onClose={handleCloseSignup}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Signup onClose={handleCloseSignup} />
        </Box>
      </Modal>

      <Modal open={openLogin} onClose={handleCloseLogin}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Login onClose={handleCloseLogin} />
        </Box>
      </Modal>
    </>
  );
}

export default Welcome;
