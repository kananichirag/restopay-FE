import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage for web
import { combineReducers } from 'redux';
import authReducer from './slices/AuthSlice';
import MenuReducer from "./slices/MenuSlice"
import CustomerReducer from "./slices/CustomerSlice";
import QrCodeReducer from "./slices/QrSlice";
import RestaurantsReducer from './slices/RestaurantSlice';
import OrdersReducer from "./slices/OrderSlice";
import StaffReducer from "./slices/StaffSlice";
import ChefsReducer from "./slices/ChefsSlice";
import InventoryReducer from './slices/InventorySlice';
// Persist Configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authReducer,
    menu: MenuReducer,
    customer: CustomerReducer,
    qrCode: QrCodeReducer,
    restaurant: RestaurantsReducer,
    orders: OrdersReducer,
    staff: StaffReducer,
    chef: ChefsReducer,
    inventory: InventoryReducer
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
