import { createSlice } from '@reduxjs/toolkit';
import { fetchOrdersByBuyer, fetchOrdersBySeller } from './orderActions.js';

/**
 * Order slice to handle orders state in Redux
 * @type {Slice<{sellerOrders: *[], loading: boolean, error: null, buyerOrders: *[]}, {}, string, string, SliceSelectors<{sellerOrders: *[], loading: boolean, error: null, buyerOrders: *[]}>>}
 */
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    buyerOrders: [],
    sellerOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByBuyer.fulfilled, (state, action) => {
        state.buyerOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersByBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchOrdersBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersBySeller.fulfilled, (state, action) => {
        state.sellerOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default orderSlice.reducer;
