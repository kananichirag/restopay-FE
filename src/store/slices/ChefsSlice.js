import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchAllChefs = createAsyncThunk(
    'chef/fetchAllChefs',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("Authtoken");
            if (!token) {
                toast.error("Token is required");
                return rejectWithValue("Token is required");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/chef/getallchef`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message || 'Failed to fetch chefs');
            }

            if (!response.data.chefs || response.data.chefs.length === 0) {
                return [];
            }

            return response.data.chefs;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);

const initialState = {
    chefs: [],
    status: 'idle',
    error: null,
};

const chefsSlice = createSlice({
    name: 'chef',
    initialState,
    reducers: {
        addChef: (state, action) => {
            state.chefs.push(action.payload);
        },
        deleteChef: (state, action) => {
            state.chefs = state.chefs.filter(
                member => member._id !== action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllChefs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllChefs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chefs = action.payload;
                state.error = null;
            })
            .addCase(fetchAllChefs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.chefs = [];
            });
    }
});

export const { addChef, deleteChef } = chefsSlice.actions;
export default chefsSlice.reducer;