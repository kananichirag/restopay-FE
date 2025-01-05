import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';


export const fetchQrCodes = createAsyncThunk(
    'qrcode/fetchQrCodes',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const restaurantId = state.auth.user.restaurant_id;
            if (!restaurantId) {
                throw new Error('Restaurant ID is missing');
            }

            const token = localStorage.getItem('Authtoken');
            if (!token) {
                throw new Error('Authentication token is missing');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_REACT_BASE_URL}/manager/getallqr/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.data.success === false) {
                toast.error(response.data.message || 'Failed to fetch QR codes');
                return rejectWithValue(response.data.message);
            }

            if (!response.data.AllQr || response.data.AllQr.length === 0) {
                return rejectWithValue('No QR codes found');
            }
            return response.data.AllQr;
        } catch (error) {
            return rejectWithValue(error.message || error.response?.data || 'Something went wrong');
        }
    }
);

const initialState = {
    qrCodes: [],
    status: 'idle',
    error: null,
};

const qrCodeSlice = createSlice({
    name: 'qrcode',
    initialState,
    reducers: {
        addQrCode: (state, action) => {
            state.qrCodes.push(action.payload);
        },
        deleteQrCode: (state, action) => {
            state.qrCodes = state.qrCodes.filter((code) => code._id !== action.payload._id);
        },
        updateQrCode: (state, action) => {
            const { _id, ...updatedFields } = action.payload;

            const codeIndex = state.qrCodes.findIndex((code) => code._id === _id);

            if (codeIndex !== -1) {
                state.qrCodes[codeIndex] = {
                    ...state.qrCodes[codeIndex],
                    ...updatedFields,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQrCodes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchQrCodes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.qrCodes = action.payload;
            })
            .addCase(fetchQrCodes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch QR codes';
            });
    },
});

export const { addQrCode, deleteQrCode, updateQrCode } = qrCodeSlice.actions;
export default qrCodeSlice.reducer;
