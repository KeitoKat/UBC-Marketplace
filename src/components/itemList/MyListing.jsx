import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Button,
  Checkbox,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchItems, deleteItems } from '../../redux/actions';
import ItemCard from './ItemCard';

const ITEMS_PER_PAGE = 6;

/**
 * MyListing component displays the items that the user has posted
 * Handles the selection of items, deletion of items, and navigation
 * Has buttons to select all, edit, delete, and post new items
 * @returns {JSX.Element}
 */
const MyListing = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.itemList);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    dispatch(
      fetchItems({ search: '', category: '', minPrice: 0, maxPrice: 3000 }),
    );
  }, [dispatch]);

  useEffect(() => {
    setSelectedItems([]);
  }, [items]);

  const filteredItems = items.filter((item) => item.owner._id === userId);
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

  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  const handleDelete = () => {
    dispatch(deleteItems(selectedItems)).then(() => {
      dispatch(
        fetchItems({ search: '', category: '', minPrice: 0, maxPrice: 3000 }),
      );
      setSelectedItems([]);
      setOpenSnackbar(true); // Show snackbar
    });
  };

  const handleEdit = () => {
    navigate(`/edit-item/${selectedItems[0]}`);
  };

  const handlePostNew = () => {
    navigate('/post-new');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ minWidth: '100%', marginBottom: '5vh' }}>
      <Box sx={{ p: 1 }}>
        {/* Upper box: text "My Listing", buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">My Listings</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSelectAll}
            >
              {selectedItems.length === filteredItems.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              disabled={selectedItems.length !== 1}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDelete}
              disabled={selectedItems.length === 0}
            >
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={handlePostNew}>
              Post New
            </Button>
          </Box>
        </Box>
      </Box>

      {itemsToDisplay.length > 0 ? (
        <Grid container spacing={10} justifyContent="center">
          {itemsToDisplay.map((item) => (
            <Grid item key={item.id}>
              <Box key={item.id}>
                <ItemCard item={item} isOwned={true} />
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="h4">No Items Found.</Typography>
        </Box>
      )}

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={() => handleChangePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {[...Array(totalPages).keys()].map((page) => (
          <Button
            key={page + 1}
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

      {/* Snackbar for delete confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Deleted
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MyListing;
