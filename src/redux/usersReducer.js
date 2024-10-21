import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const resendVerificationEmail = createAsyncThunk(
  'users/resendVerificationEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/resend-verification`,
        { email },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData, { rejectWithValue }) => {
    if (!userData.email.endsWith('ubc.ca')) {
      return rejectWithValue('Email must end with ubc.ca');
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes('email')
      ) {
        return rejectWithValue('Email already exists');
      }
      return rejectWithValue(error.response.data);
    }
  },
);

export const loginUserAction = createAsyncThunk(
  'users/loginUserAction',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, userData);
      localStorage.setItem('user', JSON.stringify(response.data)); // Save user info to localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const verifyEmailAction = createAsyncThunk(
  'users/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/auth/verify-email?token=${token}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/**
 * Edit user profile information
 * @type {AsyncThunk<unknown, void, AsyncThunkConfig>}
 */
export const editUser = createAsyncThunk(
  'users/editUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userData._id}`,
        userData,
      );
      localStorage.setItem('user', JSON.stringify(response.data)); // Save updated user info to localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/**
 * Delete user account by userId
 * @type {AsyncThunk<unknown, void, AsyncThunkConfig>}
 */
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const archiveUser = createAsyncThunk(
  'users/archiveUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${userId}/status`, {
        isArchived: true,
      });
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const recoverUser = createAsyncThunk(
  'users/recoverUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${userId}/status`, {
        isArchived: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const INITIAL_STATE = {
  users: [],
  loggedInUser: null,
  registerStatus: '',
  registerError: '',
  loginStatus: '',
  loginError: '',
  verifyStatus: '',
  resendStatus: '',
  resendError: '',
  editStatus: '',
  editError: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState: INITIAL_STATE,
  reducers: {
    logoutUser: (state) => {
      state.loggedInUser = null;
      localStorage.removeItem('user'); // Clear user info from localStorage
      localStorage.removeItem('userName');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAdmin'); // Remove isAdmin from localStorage
      localStorage.removeItem('userId');
    },
    setRegisterStatus: (state, action) => {
      state.registerStatus = action.payload;
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload;
    },
    setVerifyStatus: (state, action) => {
      state.verifyStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // Store user info in localStorage
        localStorage.setItem('userName', action.payload.name);
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('isAdmin', action.payload.isAdmin); // Store isAdmin in localStorage
        localStorage.setItem('isArchived', action.payload.isArchived);
        state.registerStatus = 'success';
        state.registerError = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.registerError = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        localStorage.setItem('userId', action.payload.id); // Store userId in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload)); // Store user info in localStorage
        localStorage.setItem('userName', action.payload.name);
        localStorage.setItem('userToken', action.payload.token);
        localStorage.setItem('isAdmin', action.payload.isAdmin); // Store isAdmin in localStorage
        localStorage.setItem('isArchived', action.payload.isArchived);
        state.loginStatus = 'success';
        state.loginError = '';
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.loginError = action.payload || action.error.message;
      })
      .addCase(loginUserAction.pending, (state) => {
        state.loginStatus = 'loading';
      })
      .addCase(verifyEmailAction.fulfilled, (state) => {
        state.verifyStatus = 'success';
      })
      .addCase(verifyEmailAction.rejected, (state) => {
        state.verifyStatus = 'failed';
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.resendStatus = 'success';
        state.resendError = '';
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendStatus = 'failed';
        state.resendError = action.payload || action.error.message;
      })
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resendStatus = 'loading';
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); // Store updated user info in localStorage
        state.editStatus = 'success';
        state.editError = '';
      })
      .addCase(editUser.rejected, (state, action) => {
        state.editStatus = 'failed';
        state.editError = action.payload || action.error.message;
      })
      .addCase(editUser.pending, (state) => {
        state.editStatus = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loggedInUser = null;
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        localStorage.removeItem('isArchive');
      })
      .addCase(archiveUser.fulfilled, (state, action) => {
        state.loggedInUser = null;
        localStorage.removeItem('userName');
        localStorage.removeItem('userToken');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
      })
      .addCase(archiveUser.rejected, (state, action) => {
        state.archiveStatus = 'failed';
        state.archiveError = action.payload || action.error.message;
      })
      .addCase(recoverUser.fulfilled, (state, action) => {
        state.loggedInUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(recoverUser.rejected, (state, action) => {
        state.archiveStatus = 'failed';
        state.archiveError = action.payload || action.error.message;
      });
  },
});

export const {
  logoutUser,
  setRegisterStatus,
  setLoginStatus,
  setVerifyStatus,
} = userSlice.actions;

export default userSlice.reducer;
