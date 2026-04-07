import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // array of { product, quantity }
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }

      state.totalItems += 1;
      state.totalPrice += product.price;
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex(item => item.product._id === productId);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalItems -= item.quantity;
        state.totalPrice -= item.product.price * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);

      if (item) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalItems += diff;
        state.totalPrice += item.product.price * diff;

        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.product._id !== productId);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;