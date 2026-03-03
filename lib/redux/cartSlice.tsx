import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartLineItem = {
	quantity: number;
	productVariant: {
		id: string;
		price: string;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
};

export type Cart = {
	id: string;
	lineItems: CartLineItem[];
};

interface CartState {
	cart: Cart | null;
	items: CartLineItem[];
	itemCount: number;
	subtotal: string;
	isOpen: boolean;
}

const initialState: CartState = {
	cart: null,
	items: [],
	itemCount: 0,
	subtotal: "0",
	isOpen: false,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItem: (state, action: PayloadAction<CartLineItem>) => {
			const existingItem = state.items.find(
				(item) => item.productVariant.id === action.payload.productVariant.id,
			);

			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}

			state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
			state.subtotal = state.items
				.reduce((sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity), BigInt(0))
				.toString();
		},
		removeItem: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item.productVariant.id !== action.payload);
			state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
			state.subtotal = state.items
				.reduce((sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity), BigInt(0))
				.toString();
		},
		increaseQuantity: (state, action: PayloadAction<string>) => {
			const item = state.items.find((item) => item.productVariant.id === action.payload);
			if (item) {
				item.quantity += 1;
				state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
				state.subtotal = state.items
					.reduce((sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity), BigInt(0))
					.toString();
			}
		},
		decreaseQuantity: (state, action: PayloadAction<string>) => {
			const item = state.items.find((item) => item.productVariant.id === action.payload);
			if (item && item.quantity > 1) {
				item.quantity -= 1;
				state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
				state.subtotal = state.items
					.reduce((sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity), BigInt(0))
					.toString();
			} else if (item && item.quantity === 1) {
				state.items = state.items.filter((item) => item.productVariant.id !== action.payload);
				state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
				state.subtotal = state.items
					.reduce((sum, item) => sum + BigInt(item.productVariant.price) * BigInt(item.quantity), BigInt(0))
					.toString();
			}
		},
		clearCart: (state) => {
			state.items = [];
			state.itemCount = 0;
			state.subtotal = "0";
		},
		toggleCart: (state) => {
			state.isOpen = !state.isOpen;
		},
		setCartOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
	},
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, toggleCart, setCartOpen } =
	cartSlice.actions;

// biome-ignore lint/style/noDefaultExport: Redux Toolkit reducer export
export default cartSlice.reducer;
