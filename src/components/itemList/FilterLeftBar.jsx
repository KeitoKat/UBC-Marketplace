import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Input,
  Typography,
  Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, setPriceRangeFilter } from '../../redux/itemsReducer';
import { useState, useEffect } from 'react';

/**
 * Sidebar component
 * Displays a sidebar with filters for searching items
 * Handles updating the filters and price range
 * @returns {JSX.Element}
 */
const Sidebar = () => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 3000;

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.items.filters);
  const [value, setValue] = useState([MIN_PRICE, MAX_PRICE]);

  useEffect(() => {
    setValue(filters.priceRange);
  }, [filters.priceRange]);

  const handleFilterChange = (event) => {
    dispatch(setFilters(event.target.name));
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setPriceRangeFilter(newValue));
  };

  const handleInputChange = (event, index) => {
    const newValue =
      event.target.value === '' ? MIN_PRICE : Number(event.target.value);
    const updatedValue = [...value];
    updatedValue[index] = newValue;
    setValue(updatedValue);
    dispatch(setPriceRangeFilter(updatedValue));
  };

  return (
    <Box
      sx={{
        width: 250,
        padding: 2,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        '@media (max-width: 450px)': {
          '&::placeholder': {
            width: 100,
            fontSize: 10,
          },
        },
      }}
    >
      <FormGroup>
        {Object.keys(filters.categories).map((filter) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.categories[filter]}
                onChange={handleFilterChange}
                name={filter}
              />
            }
            label={filter}
            key={filter}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '1rem',
                '@media (max-width: 400px)': {
                  fontSize: '0.8rem',
                },
              },
            }}
          />
        ))}

        <br />

        <Box
          sx={{
            width: 250,
            fontSize: '1rem',
            '@media (max-width: 400px)': {
              fontSize: '0.8rem',
            },
            '& .MuiTypography-root': {
              fontSize: 'inherit',
            },
            '& .MuiInputBase-root': {
              fontSize: 'inherit',
            },
            '& .MuiSlider-root': {
              fontSize: 'inherit',
            },
          }}
        >
          <Typography gutterBottom>Price Range ($)</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Input
                value={value[0]}
                size="small"
                onChange={(event) => handleInputChange(event, 0)}
                inputProps={{
                  min: MIN_PRICE,
                  max: MAX_PRICE,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
            <Grid item xs>
              <Slider
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                aria-labelledby="input-slider"
                min={MIN_PRICE}
                max={MAX_PRICE}
              />
            </Grid>
            <Grid item>
              <Input
                value={value[1]}
                size="small"
                onChange={(event) => handleInputChange(event, 1)}
                inputProps={{
                  min: MIN_PRICE,
                  max: MAX_PRICE,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
          <Typography>Maximum price: ${MAX_PRICE}</Typography>
        </Box>
      </FormGroup>
    </Box>
  );
};

export default Sidebar;
