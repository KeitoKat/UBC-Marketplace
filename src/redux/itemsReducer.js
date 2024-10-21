import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchItems,
  addItem,
  deleteItem,
  editItem,
  deleteItems,
  fetchAllPosts,
} from './actions';

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const MIN_PRICE = 0;
const MAX_PRICE = 3000;

export const archiveItem = createAsyncThunk(
  'items/archiveItem',
  async ({ id, isArchived }, { rejectWithValue }) => {
    try {
      console.log(
        `Sending request to archive item ${id} with isArchived=${isArchived}`,
      );
      const response = await axios.put(`${BASE_URL}/items/${id}/status`, {
        isArchived,
      });
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    itemList: [],
    searchTerm: '',
    filters: {
      categories: {
        Books: true,
        'Lab Kits': true,
        Electronics: true,
        Other: true,
      },
      priceRange: [MIN_PRICE, MAX_PRICE],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      if (action.payload in state.filters.categories) {
        state.filters.categories[action.payload] =
          !state.filters.categories[action.payload];
      }
    },
    setPriceRangeFilter: (state, action) => {
      state.filters.priceRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.itemList = action.payload.filter((item) => !item.isArchived);
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.itemList.push(action.payload);
        state.loading = false;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.itemList = state.itemList.filter(
          (item) => item._id !== action.payload,
        );
        state.loading = false;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Edit item
      .addCase(editItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editItem.fulfilled, (state, action) => {
        const index = state.itemList.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          if (!action.payload.isArchived) {
            state.itemList[index] = action.payload;
          }
        }
        state.loading = false;
      })
      .addCase(editItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch all posts (for admin)
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.itemList = action.payload.filter((item) => !item.isArchived);
        state.loading = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete multiple items
      .addCase(deleteItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItems.fulfilled, (state, action) => {
        state.itemList = state.itemList.filter(
          (item) => !action.payload.ids.includes(item._id),
        );
        state.loading = false;
      })
      .addCase(deleteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setFilters, setPriceRangeFilter } =
  itemsSlice.actions;

export default itemsSlice.reducer;
