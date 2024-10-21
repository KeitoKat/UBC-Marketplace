import React from 'react';
import { Box, Typography, Container, Link, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import GitHubIcon from '@mui/icons-material/GitHub';

/**
 * Footer component
 * @returns {Element}
 */
const Footer = () => {
  const theme = createTheme();
  theme.typography.h6 = {
    fontSize: '1rem',
    '@media (min-width:700px)': {
      fontSize: '1.1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  };
  theme.typography.body2 = {
    fontSize: '1rem',
    '@media (min-width:700px)': {
      fontSize: '1.1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: 'transparent',
        color: grey[700],
        borderTop: '1px solid',
        borderImage:
          'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)) 1',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <ThemeProvider theme={theme}>
              <Typography variant="h6" align="center" gutterBottom>
                © 2024 Wait Blisters
              </Typography>
              <Typography variant="body2" align="center">
                All rights reserved.
              </Typography>
            </ThemeProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Link
                href="https://github.com/ubc-cpsc455-2024S/project-12_wait-blisters"
                color="inherit"
                sx={{ mx: 1 }}
              >
                <GitHubIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Made with ♥ by the Wait Blisters team.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
