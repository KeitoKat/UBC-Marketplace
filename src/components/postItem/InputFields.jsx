import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Input,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  InputAdornment,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/actions';
import SnackbarNotif from './SnackbarNotif';
import ImageCard from './ImageCard';
import LoadingScreen from './LoadingScreen';
/**
 * InputField component
 * Displays a form for users to input item details
 * Handles image upload, form submission, and snackbar notifications
 * @returns {JSX.Element}
 */
const InputField = () => {
  const userId = localStorage.getItem('userId') || null;
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [GPTName, setGPTName] = useState('');
  const [browserLocation, setBrowserLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handleCondition = (event) => {
    setCondition(event.target.value);
  };

  const handleImage = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);

    try {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const BASE = import.meta.env.VITE_SERVER_URL;
      const response = await axios.post(`${BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrls = response.data.urls;
      const gptResponse = await axios.post(`${BASE}/gpt-suggest`, {
        images: imageUrls,
      });

      setGPTName(gptResponse.data.suggestedName);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching GPT name suggestion:', error);
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (imageToDelete) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image !== imageToDelete),
    );
    setImageFiles((prevFiles) =>
      prevFiles.filter((file) => URL.createObjectURL(file) !== imageToDelete),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !category ||
      !condition ||
      !name ||
      !description ||
      !price ||
      !location
    ) {
      setSnackbarMessage('Please complete your form first');
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      imageFiles.forEach((image) => formData.append('images', image));

      const uploadRes = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      const imageUrls = uploadRes.data.urls;

      const newItem = {
        id: uuid(),
        image: imageUrls,
        category: category,
        condition: condition,
        name: name || GPTName,
        description: description,
        price: price,
        location: location,
        owner: userId,
      };

      await dispatch(addItem(newItem)).unwrap();
      setSnackbarMessage('Item Added');
      setOpenSnackbar(true);
      resetForm();
    } catch (error) {
      setSnackbarMessage(error);
      setOpenSnackbar(true);
      console.error('Error uploading item:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const resetForm = () => {
    setImages([]);
    setImageFiles([]);
    setCategory('');
    setCondition('');
    setName('');
    setDescription('');
    setPrice('');
    setLocation('');
    setIsManualMode(false);
    setGPTName('');
    setBrowserLocation('');
  };

  const handleCancelGPT = () => {
    setIsLoading(false);
    setIsManualMode(true);
  };

  const handleSuggestionClick = () => {
    setName(GPTName);
  };

  const handleLocationClick = () => {
    setLocation(browserLocation);
  };

  const getBrowserLocation = () => {
    if (!navigator.geolocation) {
      setSnackbarMessage('Geolocation is not supported by your browser');
      setOpenSnackbar(true);
    } else {
      setLocationLoading(true); // Show loading screen
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude}, Lon: ${longitude}`;
          setBrowserLocation(locationString);
          setLocationLoading(false); // Hide loading screen
        },
        (error) => {
          setSnackbarMessage(`Error getting location: ${error.message}`);
          setOpenSnackbar(true);
          setLocationLoading(false); // Hide loading screen
        },
      );
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Stack
          spacing={2}
          direction="column"
          sx={{ width: '50ch' }}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5">Create an item listing:</Typography>

          <Button variant="outlined" startIcon={<AddToPhotosIcon />}>
            Upload Image
            <Input
              type="file"
              accept="image/png, image/jpeg"
              style={{ opacity: 0, position: 'absolute', height: '100px' }}
              multiple
              onChange={handleImage}
            />
          </Button>

          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <ImageCard
                  key={index}
                  image={image}
                  onDeleteImage={handleDeleteImage}
                />
              </Grid>
            ))}
          </Grid>

          {isLoading && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                Generating Name Using GPT...
              </Typography>
              <LinearProgress />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancelGPT}
                sx={{ mt: 1 }}
              >
                Cancel
              </Button>
            </Box>
          )}

          {!isLoading && (
            <>
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                direction="row"
                useFlexGap
                flexWrap="wrap"
              >
                <FormControl sx={{ m: 1, minWidth: 170 }}>
                  <InputLabel id="category">Category*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="category-id"
                    label="Category*"
                    onChange={handleCategory}
                    value={category}
                  >
                    <MenuItem value={'Books'}>Books</MenuItem>
                    <MenuItem value={'Lab Kits'}>Lab Kits</MenuItem>
                    <MenuItem value={'Electronics'}>Electronics</MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 170 }}>
                  <InputLabel id="condition">Condition*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="condition-id"
                    label="Condition*"
                    onChange={handleCondition}
                    value={condition}
                  >
                    <MenuItem value={'New'}>New</MenuItem>
                    <MenuItem value={'Like-new'}>Like-new</MenuItem>
                    <MenuItem value={'Used'}>Used</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <FormControl
                component="form"
                noValidate
                autoComplete="off"
                required
                fullWidth
              >
                <TextField
                  label="Name*"
                  placeholder={
                    images.length > 0
                      ? GPTName
                      : 'eg. White Philips E-toothbrush'
                  }
                  value={name}
                  onChange={handleName}
                  disabled={isLoading}
                />
                {GPTName && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Suggested Name
                    </Typography>
                    <Chip
                      label={GPTName}
                      onClick={handleSuggestionClick}
                      sx={{
                        mt: 1,
                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
                        color: '#3f51b5',
                        width: 'auto',
                      }}
                      clickable
                    />
                  </>
                )}
              </FormControl>
              <FormControl
                component="form"
                noValidate
                autoComplete="off"
                required
                fullWidth
              >
                <TextField
                  id="description"
                  label="Description*"
                  multiline
                  rows={4}
                  placeholder="Reason For Selling..."
                  value={description}
                  onChange={handleDescription}
                />
              </FormControl>
              <FormControl
                component="form"
                noValidate
                autoComplete="off"
                required
                fullWidth
              >
                <InputLabel>Price</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-price"
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  label="Price*"
                  value={price}
                  onChange={handlePrice}
                />
              </FormControl>
              <FormControl
                component="form"
                noValidate
                autoComplete="off"
                required
                fullWidth
              >
                <TextField
                  label="Pick-up Location*"
                  placeholder="eg. UBC Bus Loop"
                  value={location}
                  onChange={handleLocation}
                />
                {browserLocation && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Suggested Location
                    </Typography>
                    <Chip
                      label={browserLocation}
                      onClick={handleLocationClick}
                      sx={{
                        mt: 1,
                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
                        color: '#3f51b5',
                        width: 'auto',
                      }}
                      clickable
                    />
                  </>
                )}
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={getBrowserLocation}
                sx={{ mb: 2 }}
                startIcon={<LocationOnIcon />}
              >
                Get Location
              </Button>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <SnackbarNotif
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        onCloseSnackbar={handleCloseSnackbar}
      />

      {locationLoading && <LoadingScreen message="Getting your location..." />}
    </>
  );
};

export default InputField;
