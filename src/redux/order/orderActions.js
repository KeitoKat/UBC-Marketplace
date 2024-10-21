import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Fetch all orders by buyer
 * @type {AsyncThunk<Promise<any>, void, AsyncThunkConfig>}
 */
export const fetchOrdersByBuyer = createAsyncThunk(
  'orders/fetchOrdersByBuyer',
  async (userId) => {
    const response = await axios.get(`${BASE_URL}/orders/buyer/${userId}`);
    return response.data;
  },
);

/**
 * Fetch all orders by seller
 * @type {AsyncThunk<Promise<any>, void, AsyncThunkConfig>}
 */
export const fetchOrdersBySeller = createAsyncThunk(
  'orders/fetchOrdersBySeller',
  async (userId) => {
    const response = await axios.get(`${BASE_URL}/orders/seller/${userId}`);
    return response.data;
  },
);

/**
 * Fetch order by id for buyer
 * @type {AsyncThunk<unknown, void, AsyncThunkConfig>}
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred while adding the order.');
    }
  },
);

/**
 * Fetch order by id for buyer and seller
 * @type {AsyncThunk<unknown, void, AsyncThunkConfig>}
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/orders/${orderId}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(
        'An error occurred while updating the order status.',
      );
    }
  },
);
