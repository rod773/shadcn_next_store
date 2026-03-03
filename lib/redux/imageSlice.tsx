import { createSlice } from "@reduxjs/toolkit";

export type ImageState = {
	currentImages: string[];
	selectedImageIndex: number;
	isZoomed: boolean;
	selectedVariant: string | null;
};

const initialState: ImageState = {
	currentImages: [],
	selectedImageIndex: 0,
	isZoomed: false,
	selectedVariant: null,
};

const imageSlice = createSlice({
	name: "image",
	initialState,
	reducers: {
		setImages: (state, action) => {
			state.currentImages = action.payload;
			state.selectedImageIndex = 0;
		},
		setSelectedImageIndex: (state, action) => {
			state.selectedImageIndex = action.payload;
		},
		toggleZoom: (state) => {
			state.isZoomed = !state.isZoomed;
		},
		setSelectedVariant: (state, action) => {
			state.selectedVariant = action.payload;
		},
	},
});

export const { setImages, setSelectedImageIndex, toggleZoom, setSelectedVariant } = imageSlice.actions;

// biome-ignore lint/style/noDefaultExport: Redux Toolkit reducer export
export default imageSlice.reducer;
