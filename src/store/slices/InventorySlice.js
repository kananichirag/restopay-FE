import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchAllInventorys = createAsyncThunk(
    'inventory/fetchAllInventory',
    async (_, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem("Authtoken");
            if (!token) {
                toast.error("Token is required");
                return rejectWithValue("Token is required");
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/inventory/getallinventorys`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch order items');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.inventorys || response.data.inventorys.length === 0) {
                return rejectWithValue('No Inventorys found');
            }

            return response.data.inventorys;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);


const initialState = {
    inventorys: [],
    status: 'idle',
    error: null,
};


const inventorysSlice = createSlice({
    name: 'inventorys',
    initialState,
    reducers: {
        addInventory: (state, action) => {
            const inventory = action.payload;
            console.log(inventory);
            if (inventory) {
                state.inventorys.push(inventory);
            } else {
                toast.error('Invalid inventory data');
            }
        },

        removeInventory: (state, action) => {
            const id = action.payload;
            if (id) {
                state.inventorys = state.inventorys.filter((inventory) => inventory._id !== id);
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllInventorys.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllInventorys.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.inventorys = action.payload;
            })
            .addCase(fetchAllInventorys.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.inventorys = [];
            });
    }

});

export const { addInventory, removeInventory } = inventorysSlice.actions;
export default inventorysSlice.reducer;