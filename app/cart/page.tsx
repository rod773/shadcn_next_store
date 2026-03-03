"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { clearCart, decreaseQuantity, increaseQuantity, removeItem } from "@/lib/redux/cartSlice";
import type { RootState } from "@/lib/redux/store";
import { store } from "@/lib/redux/store";

// Get current state directly from store
function getCartState() {
	const state = store.getState() as RootState;
	return state.cart;
}

export default function CartPage() {
	const { items, subtotal } = getCartState();

	const handleCheckout = () => {
		window.location.href = "/checkout";
	};

	const handleClearCart = () => {
		store.dispatch(clearCart());
	};

	const handleRemoveItem = (id: string) => {
		store.dispatch(removeItem(id));
	};

	const handleDecreaseQuantity = (id: string) => {
		store.dispatch(decreaseQuantity(id));
	};

	const handleIncreaseQuantity = (id: string) => {
		store.dispatch(increaseQuantity(id));
	};

	return (
		<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
				<p className="text-muted-foreground">Manage your cart items and proceed to checkout.</p>
			</header>

			<section className="space-y-4">
				<h2 className="text-lg font-medium">Cart items</h2>

				{items.length === 0 ? (
					<div className="text-center py-12 space-y-4">
						<p className="text-sm text-muted-foreground">Your cart is empty.</p>
						<Button onClick={() => (window.location.href = "/")}>Continue shopping</Button>
					</div>
				) : (
					<div className="space-y-4">
						<div className="divide-y divide-border rounded-lg border border-border">
							{items.map((item) => (
								<div key={item.productVariant.id} className="flex gap-3 py-4">
									<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
										<Image
											src={item.productVariant.images[0]}
											alt={item.productVariant.product.name}
											fill
											className="object-cover"
											sizes="96px"
										/>
									</div>
									<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
										<div className="flex items-start justify-between gap-2">
											<h3 className="text-sm font-medium leading-tight text-foreground line-clamp-2">
												{item.productVariant.product.name}
											</h3>
											<button
												type="button"
												onClick={() => handleRemoveItem(item.productVariant.id)}
												className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
											>
												×
											</button>
										</div>
										<div className="flex items-center justify-between">
											<div className="inline-flex items-center rounded-full border border-border">
												<button
													type="button"
													onClick={() => handleDecreaseQuantity(item.productVariant.id)}
													className="shrink-0 flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-secondary transition-colors"
												>
													−
												</button>
												<span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums">
													{item.quantity}
												</span>
												<button
													type="button"
													onClick={() => handleIncreaseQuantity(item.productVariant.id)}
													className="shrink-0 flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-secondary transition-colors"
												>
													+
												</button>
											</div>
											<span className="text-sm font-semibold">
												{formatMoney({
													amount: BigInt(item.productVariant.price) * BigInt(item.quantity),
													currency: CURRENCY,
													locale: LOCALE,
												})}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between text-base">
							<span className="font-medium">Subtotal</span>
							<span className="font-semibold">
								{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
							</span>
						</div>

						<p className="text-xs text-muted-foreground">
							Shipping, taxes, and payment are omitted in this demo.
						</p>
					</div>
				)}
			</section>

			{items.length > 0 && (
				<section className="space-y-3">
					<div className="flex gap-3">
						<Button className="flex-1 h-11" onClick={handleCheckout}>
							Proceed to checkout
						</Button>
						<Button variant="outline" className="h-11" onClick={handleClearCart}>
							Clear cart
						</Button>
					</div>
					<Button variant="ghost" onClick={() => (window.location.href = "/")}>
						Continue shopping
					</Button>
				</section>
			)}
		</main>
	);
}
