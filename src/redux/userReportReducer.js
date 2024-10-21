// redux/userReportReducer.js
import { createSlice } from '@reduxjs/toolkit';
import {
  submitUserReport,
  fetchAllUserReports,
  resolveUserReport,
} from './userReportActions';

const userReportSlice = createSlice({
  name: 'userReports',
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitUserReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.loading = false;
      })
      .addCase(submitUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllUserReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resolveUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveUserReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id,
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(resolveUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default userReportSlice.reducer;
