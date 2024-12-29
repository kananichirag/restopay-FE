import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage for web
import { combineReducers } from 'redux';
import authReducer from './slices/AuthSlice';
import MenuReducer from "./slices/MenuSlice" // Create an authSlice for login data

// Persist Configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authReducer,
    menu: MenuReducer
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
