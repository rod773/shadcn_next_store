"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { setCartOpen } from "@/lib/redux/cartSlice";
import type { RootState } from "@/lib/redux/store";
import { store } from "@/lib/redux/store";

export function CartSidebar() {
	const cart = useSyncExternalStore(
		store.subscribe,
		() => (store.getState() as RootState).cart,
		() => (store.getState() as RootState).cart,
	);
	const { isOpen, items, itemCount, subtotal } = cart;

	const closeCart = () => {
		store.dispatch(setCartOpen(false));
	};

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-2">
						Your Cart
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-medium">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button variant="outline" onClick={closeCart}>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<div key={item.productVariant.id} className="flex gap-3 py-4">
										<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
											<Image
												src={
													item.productVariant.images?.[0] ||
													item.productVariant.product.images?.[0] ||
													"/placeholder.jpg"
												}
												alt={item.productVariant.product.name}
												fill
												className="object-cover"
												sizes="96px"
											/>
										</div>
										<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
											<div className="flex items-start justify-between gap-2">
												<p className="text-sm font-medium leading-tight text-foreground line-clamp-2">
													{item.productVariant.product.name}
												</p>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">Qty {item.quantity}</span>
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
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">Subtotal</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
								<Button asChild className="w-full h-12 text-base font-medium">
									<YnsLink href={checkoutUrl} onClick={closeCart}>
										Checkout
									</YnsLink>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
