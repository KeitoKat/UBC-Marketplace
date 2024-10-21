import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  FormControl,
} from '@mui/material';
import {
  styled,
  alpha,
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import AccountMenu from './profileSubmenu/AccountMenu.jsx';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../redux/itemsReducer.js';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
}));

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.items.searchTerm);
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Retrieve isAdmin from localStorage

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted');
  };

  const theme = createTheme();

  theme.typography.h6 = {
    fontSize: '0',
    '@media (min-width:965px)': {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.6rem',
    },
  };

  theme.typography.iconText = {
    fontSize: '0.6rem',
    '@media (min-width:450px)': {
      fontSize: '0.7rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundImage: 'linear-gradient(to right, #101317, #617182)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Button
              component={Link}
              to="/"
              startIcon={<StoreIcon />}
              sx={{ color: 'white' }}
            >
              <ThemeProvider theme={theme}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  UBC Marketplace
                </Typography>
              </ThemeProvider>
            </Button>
            {(location.pathname === '/items' ||
              location.pathname === '/chats' ||
              location.pathname === '/admin' ||
              location.pathname === '/itemlisting' ||
              location.pathname === '/settings' ||
              location.pathname === '/profile') && (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}
              >
                <StyledButton component={Link} to="/items">
                  <ThemeProvider theme={theme}>
                    <Typography variant="iconText" sx={{ fontWeight: 'bold' }}>
                      Item Listing
                    </Typography>
                  </ThemeProvider>
                </StyledButton>
                <StyledButton component={Link} to="/chats">
                  <ThemeProvider theme={theme}>
                    <Typography variant="iconText" sx={{ fontWeight: 'bold' }}>
                      Messages
                    </Typography>
                  </ThemeProvider>
                </StyledButton>
              </Box>
            )}
            {(location.pathname === '/items' ||
              location.pathname === '/chats' ||
              location.pathname === '/admin' ||
              location.pathname === '/itemlisting' ||
              location.pathname === '/settings' ||
              location.pathname === '/profile') && (
              <FormControl
                component="form"
                onSubmit={handleSubmit}
                sx={{ minWidth: '50px' }}
              >
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearch}
                    value={searchTerm}
                  />
                </Search>
              </FormControl>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAdmin && (
                <StyledButton component={Link} to="/admin">
                  Admin Dashboard
                </StyledButton>
              )}
              <AccountMenu />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
