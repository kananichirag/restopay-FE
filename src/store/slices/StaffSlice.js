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
                return rejectWithValue("Token is required");
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/staff/get-members`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message || 'Failed to fetch staff members');
            }

            if (!response.data.members || response.data.members.length === 0) {
                return [];
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
            state.staff_members.push(action.payload);
        },
        deleteStaffMember: (state, action) => {
            state.staff_members = state.staff_members.filter(
                member => member._id !== action.payload
            );
        }
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
                state.error = null;
            })
            .addCase(fetchAllStaffMembers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.staff_members = [];
            });
    }
});

export const { addStaffMember, deleteStaffMember } = staffmembersSlice.actions;
export default staffmembersSlice.reducer;