"use client";

import { ShoppingCart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { toggleCart } from "@/lib/redux/cartSlice";
import type { RootState } from "@/lib/redux/store";
import { store } from "@/lib/redux/store";

export function CartButton() {
	const cart = useSyncExternalStore(
		store.subscribe,
		() => (store.getState() as RootState).cart,
		() => (store.getState() as RootState).cart,
	);
	const { itemCount } = cart;

	const handleCartClick = () => {
		store.dispatch(toggleCart());
	};

	return (
		<button
			type="button"
			onClick={handleCartClick}
			className="p-2 hover:bg-secondary rounded-full transition-colors relative"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 ? (
				<span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{itemCount}
				</span>
			) : null}
		</button>
	);
}
