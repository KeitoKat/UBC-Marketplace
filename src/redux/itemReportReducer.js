// redux/itemReportReducer.js
import { createSlice } from '@reduxjs/toolkit';
import {
  submitItemReport,
  fetchAllItemReports,
  resolveItemReport,
} from './itemReportActions';

const itemReportSlice = createSlice({
  name: 'itemReports',
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitItemReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitItemReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.loading = false;
      })
      .addCase(submitItemReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllItemReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllItemReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllItemReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resolveItemReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveItemReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id,
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(resolveItemReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default itemReportSlice.reducer;
