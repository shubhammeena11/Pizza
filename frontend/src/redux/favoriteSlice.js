import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {

    toggleFavorite: (state, action) => {
      const favoriteProduct = action.payload;

      const already = state.items.find(
        (item) => item._id === favoriteProduct._id,
      );

      if (already) {
        state.items = state.items.filter(
          (item) => item._id !== favoriteProduct._id,
        );
      } else {
        state.items.push(favoriteProduct);
      }
    },

    setFavorites :(state, action)=>{
         state.items = action.payload;

    }
    
  },
});

export const {toggleFavorite, setFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
