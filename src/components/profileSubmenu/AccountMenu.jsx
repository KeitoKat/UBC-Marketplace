import React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Modal,
} from '@mui/material';
import { ViewList, Settings, Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/usersReducer';
import Login from '../authentication/LogIn';

/**
 * AccountMenu component to display the user account menu
 * Includes the username, profile, listing, settings, and logout
 * MUI components used: Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Modal
 * @returns {Element}
 */
const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.users.loggedInUser);
  const userName = loggedInUser
    ? loggedInUser.name
    : localStorage.getItem('userName') || '';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/';
    setAnchorEl(null);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
    handleClose();
  };

  const handleCloseLogin = () => setOpenLogin(false);

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={userName}
              src="/broken-image.jpg"
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            width: 250,
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userName ? (
          <Box>
            <MenuItem component={Link} to="/profile" onClick={handleClose}>
              <Avatar sx={{ width: 32, height: 32 }} /> {userName}
            </MenuItem>
            <MenuItem component={Link} to="/itemlisting" onClick={handleClose}>
              <ListItemIcon>
                <ViewList fontSize="small" />
              </ListItemIcon>
              My Listing
            </MenuItem>
            <Divider />
            <MenuItem component={Link} to="/settings" onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        ) : (
          <MenuItem onClick={handleOpenLogin}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>

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
    </React.Fragment>
  );
};

export default AccountMenu;
