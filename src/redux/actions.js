import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Fetch items
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ search, category, minPrice, maxPrice }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (minPrice !== undefined) params.append('minPrice', minPrice);
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice);

    const response = await axios.get(`${BASE_URL}/items?${params.toString()}`);
    return response.data;
  },
);

// ... other actions

// Add item
export const addItem = createAsyncThunk(
  'items/addItem',
  async (item, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/items`, item);
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An error occurred while adding the item');
    }
  },
);

// Delete item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

// Edit item
export const editItem = createAsyncThunk(
  'items/editItem',
  async (
    { id, newImages, existingImages, ...itemData },
    { rejectWithValue },
  ) => {
    try {
      let uploadedImageUrls = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((image) => formData.append('images', image));
        const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrls = uploadRes.data.urls;
      }
      const allImages = [...existingImages, ...uploadedImageUrls];
      const updatedItemData = {
        ...itemData,
        image: allImages,
      };
      const response = await axios.put(
        `${BASE_URL}/items/${id}`,
        updatedItemData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

// Delete multiple items
export const deleteItems = createAsyncThunk(
  'items/deleteItems',
  async (itemIds, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/items/deleteMany`, {
        ids: itemIds,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  },
);

// Fetch all posts (for admin)
export const fetchAllPosts = createAsyncThunk(
  'posts/fetchAllPosts',
  async () => {
    const response = await axios.get(`${BASE_URL}/items`);
    return response.data;
  },
);

// Delete post (for admin)
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  const response = await axios.delete(`${BASE_URL}/items/${id}`);
  return id;
});

// Fetch conversations by participant ID
export const fetchConversations = createAsyncThunk(
  'conversion/fetchConversations',
  async (userId) => {
    const response = await axios.get(
      `${BASE_URL}/conversations/list?userId=${userId}`,
    );
    return response.data;
  },
);

// Fetch one conversation by conversation ID
export const fetchOneConversation = createAsyncThunk(
  'conversion/fetchOneConversation',
  async (conversationId) => {
    const response = await axios.get(
      `${BASE_URL}/conversations?convId=${conversationId}`,
    );
    return response.data;
  },
);

// Send a new message
export const sendNewMessage = createAsyncThunk(
  'conversion/sendNewMessage',
  async (message) => {
    const response = await axios.post(
      `${BASE_URL}/conversations/new/${message.conversationId}`,
      message,
    );
    return response.data;
  },
);

// Create a new conversation
export const newConversation = createAsyncThunk(
  'conversion/newConversation',
  async (conversation) => {
    const response = await axios.post(
      `${BASE_URL}/conversations/new`,
      conversation,
    );
    return response.data;
  },
);
