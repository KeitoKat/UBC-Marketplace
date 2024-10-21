import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Button, Modal, Fab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ItemCard from './ItemCard';
import PostNew from '../postItem/PostNew';
import { fetchItems } from '../../redux/actions';

const ITEMS_PER_PAGE = 8;
/**
 * ItemListing component
 * Displays a grid of item cards
 * Handles pagination of items
 * Handles opening the PostNew modal
 * @returns {JSX.Element}
 */
function ItemListing() {
  const { searchTerm = '', filters = {} } = useOutletContext();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.itemList);

  useEffect(() => {
    const [minPrice, maxPrice] = filters.priceRange;
    dispatch(
      fetchItems({
        search: searchTerm,
        category: filters.category,
        minPrice,
        maxPrice,
      }),
    );
  }, [dispatch, searchTerm, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const [openPostNew, setOpenPostNew] = useState(false);

  const handleOpenPostNew = () => setOpenPostNew(true);
  const handleClosePostNew = () => setOpenPostNew(false);

  const isInRange = (value, min, max) => {
    return value >= min && value <= max;
  };

  const filteredItems = items.filter((item) => {
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = Object.keys(filters.categories).some(
      (filter) => filters.categories[filter] && item.category === filter,
    );
    const matchesPriceRange = isInRange(
      item.price,
      filters.priceRange[0],
      filters.priceRange[1],
    );

    return matchesSearchTerm && matchesCategory && matchesPriceRange;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const itemsToDisplay = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const currentUser = localStorage.getItem('userName');

  const theme = createTheme();
  theme.typography.h4 = {
    padding: '100px',
    fontSize: '1.2rem',
    '@media (min-width:700px)': {
      padding: '100px',
      fontSize: '1.6rem',
    },
    [theme.breakpoints.up('md')]: {
      padding: '100px',
      fontSize: '2rem',
    },
  };

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={5}>
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item) => (
              <Grid item key={item.id}>
                <ItemCard
                  item={item}
                  isOwned={currentUser === item.owner.name}
                />
              </Grid>
            ))
          ) : (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            >
              <ThemeProvider theme={theme}>
                <Typography variant="h4">
                  Sorry, No Matching Items Found.
                </Typography>
              </ThemeProvider>
            </Box>
          )}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages).keys()].map((page) => (
            <Button
              key={page + 1} // Ensure each Button has a unique key
              onClick={() => handleChangePage(page + 1)}
              disabled={currentPage === page + 1}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>

        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenPostNew}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
          }}
        >
          <AddIcon />
        </Fab>

        <Modal open={openPostNew} onClose={handleClosePostNew}>
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
            <PostNew onClose={handleClosePostNew} />
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

export default ItemListing;
