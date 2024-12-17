import {configureStore} from '@reduxjs/toolkit'
import authSlice from './reducers/auth'
import userReducer from './slices/userSlice.js'
const store = configureStore({
    reducer:{
        [authSlice.name] : authSlice.reducer,
        user:userReducer
    },
})

export default store