import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchAllStaffMembers = createAsyncThunk(
    'staff/fetchAllStaffMembers',
    async (_, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem("Authtoken");
            if (!token) {
                toast.error("Token is required");
                return;
            }
            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/staff/get-members`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            console.log(response.data)
            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch staff members');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.members || response.data.members.length === 0) {
                toast.error('No members found');
                return rejectWithValue('No members found');
            }

            return response.data.members;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);


const initialState = {
    staff_members: [],
    status: 'idle',
    error: null,
};


const staffmembersSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        addStaffMember: (state, action) => {
            const { orderData } = action.payload;
            if (orderData) {
                state.staff_members.push(orderData);
            } else {
                toast.error('Invalid order data or Razorpay Order ID');
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllStaffMembers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllStaffMembers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.staff_members = action.payload;
            })
            .addCase(fetchAllStaffMembers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.current_orders = [];
            });
    }

});

export const { addStaffMember } = staffmembersSlice.actions;
export default staffmembersSlice.reducer;