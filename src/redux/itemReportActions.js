// redux/itemReportActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = import.meta.env.VITE_SERVER_URL;
const BASE_URL = `${BASE}/itemReports`;

export const submitItemReport = createAsyncThunk(
  'itemReports/submitItemReport',
  async ({ reason, reportedBy, reportedItem }, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, {
        reason,
        reportedBy,
        reportedItem,
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
        'An error occurred while submitting the item report',
      );
    }
  },
);

export const fetchAllItemReports = createAsyncThunk(
  'itemReports/fetchAllItemReports',
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
        'An error occurred while fetching the item reports',
      );
    }
  },
);

export const resolveItemReport = createAsyncThunk(
  'itemReports/resolveItemReport',
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
        'An error occurred while resolving the item report',
      );
    }
  },
);
