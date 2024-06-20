import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    storage: AsyncStorage
};

const rootReducer = combineReducers({
    auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
});

const persistor = persistStore(store);

export { store, persistor };
