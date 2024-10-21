import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = import.meta.env.VITE_SERVER_URL;
// const BASE = 'http://localhost:3000';
const BASE_URL = `${BASE}/userReports`;

export const submitUserReport = createAsyncThunk(
  'userReports/submitUserReport',
  async ({ reason, reportedBy, reportedUser }, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, {
        reason,
        reportedBy,
        reportedUser,
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
        'An error occurred while submitting the user report',
      );
    }
  },
);

export const fetchAllUserReports = createAsyncThunk(
  'userReports/fetchAllUserReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
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
        'An error occurred while fetching the user reports',
      );
    }
  },
);

export const resolveUserReport = createAsyncThunk(
  'userReports/resolveUserReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}/resolve`);
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
        'An error occurred while resolving the user report',
      );
    }
  },
);
