import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: true,
    display:false
}

export const sidebarSlice = createSlice({
    name:"sidebar",
    initialState,
    reducers:{
        setShow:(state,action) => {
            state.show = action.payload
        },
        setDisplay:(state,action) => {
            state.display = action.payload
        }
    }
})


export const { setShow, setDisplay } = sidebarSlice.actions;
export default sidebarSlice.reducer;