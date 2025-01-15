import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchRestaurants = createAsyncThunk(
    'restaurant/fetchRestaurants',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem("Authtoken");

            if (!token) {
                throw new Error('Authorization token is missing');
            }
            const state = getState();
            const adminID = state.auth?.user?._id;

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/restaurant/getallrestaurant/${adminID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch restaurants');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.restaurants || response.data.restaurants.length === 0) {
                return rejectWithValue('No restaurants found');
            }

            return response.data.restaurants;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);


const initialState = {
    restaurants: [],
    status: 'idle',
    error: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        addRestaurant: (state, action) => {
            state.restaurants.push(action.payload);
        },
        deleteRestaurant: (state, action) => {
            state.restaurants = state.restaurants.filter(
                (restaurant) => restaurant._id !== action.payload._id
            );
        },
        updateRestaurant: (state, action) => {
            const { _id, ...updatedFields } = action.payload;

            const restaurantIndex = state.restaurants.findIndex(
                (restaurant) => restaurant._id === _id
            );

            if (restaurantIndex !== -1) {
                state.restaurants[restaurantIndex] = {
                    ...state.restaurants[restaurantIndex],
                    ...updatedFields,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.restaurants = action.payload;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch restaurants';
            });
    },
});

export const { addRestaurant, deleteRestaurant, updateRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
