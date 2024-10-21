import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CardMedia,
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
  IconButton,
} from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { fetchItems, editItem } from '../../redux/actions';
import SnackbarNotif from './SnackbarNotif';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ItemEdit component allows users to edit their item listing
 * handles image upload, deletion, and form submission
 * @param {Object} props
 * @returns {Element}
 */
const ItemEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.items.itemList);
  const item = items.find((item) => item.id === id);

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (item) {
      setExistingImages(item.image || []);
      setCategory(item.category);
      setCondition(item.condition);
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setLocation(item.location);
    } else {
      dispatch(
        fetchItems({ search: '', category: '', minPrice: 0, maxPrice: 3000 }),
      );
    }
  }, [dispatch, item]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const newImageURLs = files.map((file) => URL.createObjectURL(file));
    setExistingImages((prevImages) => [...prevImages, ...newImageURLs]);
  };

  const handleDeleteImage = (imageToDelete) => {
    setExistingImages(
      existingImages.filter((image) => image !== imageToDelete),
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
      await dispatch(
        editItem({
          id,
          newImages: imageFiles,
          category,
          condition,
          name,
          description,
          price,
          location,
          existingImages,
        }),
      ).unwrap();

      setSnackbarMessage('Item Updated');
      setOpenSnackbar(true);
      navigate('/itemlisting');
    } catch (error) {
      setSnackbarMessage('Failed to update item');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          <Typography variant="h5">Edit your item:</Typography>

          <Grid container spacing={2}>
            {existingImages.map((image, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={index}
                style={{ position: 'relative' }}
              >
                <CardMedia
                  component="img"
                  height="194"
                  image={image}
                  alt={image}
                />
                <IconButton
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }}
                  onClick={() => handleDeleteImage(image)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" startIcon={<AddToPhotosIcon />}>
            Upload New Images
            <Input
              type="file"
              accept="image/png, image/jpeg"
              style={{ opacity: 0, position: 'absolute', height: '100px' }}
              multiple
              onChange={handleImageUpload}
            />
          </Button>

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
                onChange={(e) => setCategory(e.target.value)}
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
                onChange={(e) => setCondition(e.target.value)}
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
              placeholder="eg. White Philips E-toothbrush"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
              id="description"
              label="Description*"
              multiline
              rows={4}
              placeholder="Reason For Selling..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              inputProps={{ min: 0 }}
              InputLabelProps={{ shrink: true }}
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
              onChange={(e) => setLocation(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Stack>
      </Box>

      <SnackbarNotif
        openSnackbar={openSnackbar}
        snackbarMessage={snackbarMessage}
        onCloseSnackbar={handleCloseSnackbar}
      />
    </>
  );
};

export default ItemEdit;
