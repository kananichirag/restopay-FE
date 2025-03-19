import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchAllOrders = createAsyncThunk(
    'menu/fetchAllOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const restaurantId = state.auth.user.restaurant_id;
            if (!restaurantId) {
                throw new Error('Restaurant ID is missing');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/menu/getallorders/${restaurantId}`
            );

            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch order items');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.data || response.data.data.length === 0) {
                toast.error('No Orders found');
                return rejectWithValue('No Orders found');
            }

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);


const initialState = {
    current_orders: [],
    status: 'idle',
    error: null,
};


const currentOrdersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            const { orderData } = action.payload;
            if (orderData) {
                state.current_orders.unshift(orderData);
            } else {
                toast.error('Invalid order data or Razorpay Order ID');
            }
        },
        updateOrderStatus: (state, action) => {
            const { orderId, newStatus } = action.payload;
            if (orderId && newStatus) {
                const orderIndex = state.current_orders.findIndex((order) => order.order_id === orderId);
                if (orderIndex !== -1) {
                    state.current_orders[orderIndex].status = newStatus;
                }
            } else {
                toast.error('Invalid Order ID or Status');
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.current_orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.current_orders = [];
            });
    }

});

export const { addOrder, updateOrderStatus } = currentOrdersSlice.actions;
export default currentOrdersSlice.reducer;