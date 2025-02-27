import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Fetch menu items
export const fetchCustomerMenuItems = createAsyncThunk(
    'menu/fetchCustomerMenuItems',
    async (restaurantId, { rejectWithValue }) => {
        try {
            if (!restaurantId) {
                throw new Error('Restaurant ID is missing');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_NETWORK_URL}/menu/getallitems/${restaurantId}`
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
    placeded_orders: [],
    cart: [],
    status: 'idle',
    error: null,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            if (!Array.isArray(state.cart)) {
                state.cart = [];
            }
            const existingItemIndex = state.cart.findIndex(item => item._id === action.payload._id);
            if (existingItemIndex !== -1) {
                state.cart[existingItemIndex].quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },
        incrementQuantity: (state, action) => {
            const existingItemIndex = state.cart.findIndex((item) => item._id === action.payload);
            if (existingItemIndex !== -1) {
                state.cart[existingItemIndex].quantity += 1;
            }
        },
        decrementQuantity: (state, action) => {
            const existingItemIndex = state.cart.findIndex((item) => item._id === action.payload);
            if (existingItemIndex !== -1) {
                if (state.cart[existingItemIndex].quantity > 1) {
                    state.cart[existingItemIndex].quantity -= 1; // Decrement by 1
                } else {
                    // If quantity is 1, remove the item completely from the cart
                    state.cart.splice(existingItemIndex, 1);
                }
            }
        },
        removeFromCart: (state, action) => {
            if (!Array.isArray(state.cart)) {
                state.cart = [];
            }
            const existingItemIndex = state.cart.findIndex(item => item._id === action.payload);
            if (existingItemIndex !== -1) {
                // Remove the item completely from the cart, no matter what the quantity is
                state.cart.splice(existingItemIndex, 1);
            }
        },
        emptyCart: (state) => {
            state.cart = [];
        },
        addToCustomerOrder: (state, action) => {
            const { orderData } = action.payload;
            if (orderData) {
                state.placeded_orders.push(orderData);
            } else {
                toast.error('Invalid order data or Razorpay Order ID');
            }
        },
        updateOrderStatusCustomer: (state, action) => {
            const { orderId, status } = action.payload;
            console.log(orderId, status);
            if (orderId && status) {
                const orderIndex = state.placeded_orders.findIndex((order) => order._id === orderId);
                if (orderIndex !== -1) {
                    state.placeded_orders[orderIndex].status = status;
                }
            } else {
                toast.error('Invalid Order ID or Status');
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerMenuItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCustomerMenuItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.menu = action.payload.data[0];
            })
            .addCase(fetchCustomerMenuItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch menu items';
            })
    },
});

export const { updateMenuItem, updateOrderItem, addToCart, removeFromCart, incrementQuantity, decrementQuantity, emptyCart, addToCustomerOrder, updateOrderStatusCustomer } = customerSlice.actions;
export default customerSlice.reducer;
