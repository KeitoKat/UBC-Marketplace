import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  CardMedia,
  Slide,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  IconButton,
  Grid,
  Paper,
  Popover,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReportIcon from '@mui/icons-material/Report';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { submitItemReport } from '../../redux/itemReportActions.js';
import { submitUserReport } from '../../redux/userReportActions.js';
import { newConversation } from '../../redux/actions.js';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../redux/order/orderActions.js';

const googleMapsApiKey = 'AIzaSyBPez5lmoB9ttDTsPk4cXlO28OfDWM37yk';
const mapContainerStyle = {
  height: '300px',
  width: '100%',
};
/**
 * ItemModal component
 * Displays a modal with item details
 * Allows user to report an item or user
 * @param {Object} param0
 * @returns {JSX.Element}
 */
const ItemModal = ({ open, onClose, item, userId }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [reportPopoverOpen, setReportPopoverOpen] = useState(false);
  const [reportItemOpen, setReportItemOpen] = useState(false);
  const [reportUserOpen, setReportUserOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item.location) {
      // Check if the location is in the format: "Lat: 22.3193039, Lon: 114.1693611"
      const locationMatch = item.location.match(
        /Lat:\s*(-?\d+\.\d+),\s*Lon:\s*(-?\d+\.\d+)/,
      );
      if (locationMatch) {
        const [_, lat, lon] = locationMatch;
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        // If not, fetch coordinates using geocoding API
        const fetchCoordinates = async () => {
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${item.location}&key=${googleMapsApiKey}`,
            );
            const { results } = response.data;
            if (results.length > 0) {
              setCoordinates(results[0].geometry.location);
            }
          } catch (error) {
            console.error('Error fetching coordinates:', error);
          }
        };
        fetchCoordinates();
      }
    }
  }, [item.location]);

  const handleReportPopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setReportPopoverOpen(true);
  };

  const handleReportPopoverClose = () => {
    setReportPopoverOpen(false);
  };

  const handleReportClose = () => {
    setReportItemOpen(false);
    setReportUserOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmitReport = async () => {
    try {
      if (!reportReason || !userId) {
        setSnackbarMessage('All fields are required.');
        setSnackbarOpen(true);
        return;
      }

      if (reportItemOpen) {
        await dispatch(
          submitItemReport({
            reason: reportReason,
            reportedBy: userId,
            reportedItem: item.id,
          }),
        );
      } else if (reportUserOpen) {
        await dispatch(
          submitUserReport({
            reason: reportReason,
            reportedBy: userId,
            reportedUser: item.owner._id,
          }),
        );
      }

      handleReportPopoverClose();
      setReportItemOpen(false);
      setReportUserOpen(false);
      setReportReason('');
      setSnackbarMessage('Report submitted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSnackbarMessage('Error submitting report');
      setSnackbarOpen(true);
    }
  };

  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName');
  const nav = useNavigate();

  const handleChat = () => {
    if (currentUserName === item.owner.name) {
      return;
    }
    dispatch(
      newConversation({
        receiverName: item.owner.name,
        itemId: item.id,
        senderId: currentUserId,
      }),
    );
    nav('/chats');
  };

  const handleBuyNow = async () => {
    try {
      const orderData = {
        item: item.id,
        itemName: item.name,
        buyer: userId,
        seller: item.owner._id,
        status: 'pending',
      };
      await dispatch(createOrder(orderData));
      setSnackbarMessage('Order created');
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error('Error creating order', error);
      setSnackbarMessage('Error creating order');
      setSnackbarOpen(true);
    }
  };

  const isOwner = currentUserName === item.owner.name;

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + item.image.length) % item.image.length,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.image.length);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Box
            component={Paper}
            sx={{
              width: '33%',
              maxWidth: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              outline: 'none',
            }}
          >
            <Typography variant="h4" gutterBottom>
              {item.name}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box position="relative">
                  {Array.isArray(item.image) && item.image.length > 0 && (
                    <>
                      <CardMedia
                        component="img"
                        height="300"
                        image={item.image[currentImageIndex]}
                        alt={item.name}
                        sx={{ borderRadius: 2 }}
                      />
                      {item.image.length > 1 && (
                        <>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: 0,
                              transform: 'translateY(-50%)',
                            }}
                            onClick={handlePrevImage}
                          >
                            <ArrowBackIosIcon />
                          </IconButton>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              right: 0,
                              transform: 'translateY(-50%)',
                            }}
                            onClick={handleNextImage}
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  Price: ${item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Location: {item.location}
                </Typography>
                {coordinates && (
                  <Box mt={2}>
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={coordinates}
                        zoom={15}
                      >
                        <Marker position={coordinates} />
                      </GoogleMap>
                    </LoadScript>
                  </Box>
                )}
                {!isOwner && (
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleBuyNow}
                      sx={{ borderRadius: 3 }}
                    >
                      Buy Now
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      color="primary"
                      startIcon={<ChatIcon />}
                      onClick={handleChat}
                      sx={{ borderRadius: 3 }}
                    >
                      Chat
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      color="secondary"
                      startIcon={<ReportIcon />}
                      onClick={handleReportPopoverOpen}
                      sx={{ borderRadius: 3 }}
                    >
                      Report
                    </Button>
                    <Popover
                      open={reportPopoverOpen}
                      anchorEl={anchorEl}
                      onClose={handleReportPopoverClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                    >
                      <Box p={2}>
                        <Button
                          onClick={() => {
                            setReportItemOpen(true);
                            handleReportPopoverClose();
                          }}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          Report Item
                        </Button>
                        <Button
                          onClick={() => {
                            setReportUserOpen(true);
                            handleReportPopoverClose();
                          }}
                          fullWidth
                        >
                          Report User
                        </Button>
                      </Box>
                    </Popover>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Slide>
      </Modal>

      <Dialog open={reportItemOpen} onClose={handleReportClose}>
        <DialogTitle>Report Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for reporting this item.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReport} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reportUserOpen} onClose={handleReportClose}>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for reporting this user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReport} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default ItemModal;
