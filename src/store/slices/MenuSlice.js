import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchMenuItems = createAsyncThunk(
    'menu/fetchMenuItems',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const adminId = state.auth.user._id;
            console.log('adminId', adminId);
            if (!adminId) {
                throw new Error('Restaurant ID is missing');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/menu/getmenu/${adminId}`
            );

            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch menu items');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.data || response.data.data.length === 0) {
                return rejectWithValue('No menu items found');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);


const initialState = {
    menu: null,
    status: 'idle',
    error: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.menu.items.unshift(action.payload);
        },
        deleteItem: (state, action) => {
            state.menu.items = state.menu.items.filter(item => item._id !== action.payload._id);
        },
        updateItem: (state, action) => {
            const { _id, ...updatedFields } = action.payload;

            const itemIndex = state.menu.items.findIndex((item) => item._id === _id);

            if (itemIndex !== -1) {
                state.menu.items[itemIndex] = {
                    ...state.menu.items[itemIndex],
                    ...updatedFields,
                };
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.menu = action.payload.data[0];
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch menu items';
            });
    },
});

export const { addItem, deleteItem, updateItem } = menuSlice.actions;
export default menuSlice.reducer;
