import { configureStore } from '@reduxjs/toolkit'
import userReducer  from '../features/userSlice'
import sidebarReducer  from '../features/sidebarSlice'
// import sidebarReducer from "../features/sidebarSlice"

export const store = configureStore({
  reducer: {
    user:userReducer,
    sidebar:sidebarReducer,
  }
})