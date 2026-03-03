"use server";

import { getCommerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

const hasApiKey = Boolean(process.env.YNS_API_KEY);

export async function getCart() {
	if (!hasApiKey) {
		return null;
	}

	const cartCookie = await getCartCookieJson();
	const commerce = getCommerce();

	if (!cartCookie?.id) {
		return null;
	}

	try {
		return await commerce.cartGet({ cartId: cartCookie.id });
	} catch {
		return null;
	}
}

export async function addToCart(variantId: string, quantity = 1) {
	if (!hasApiKey) {
		return { success: true, cart: null };
	}

	const cartCookie = await getCartCookieJson();
	const commerce = getCommerce();

	const cart = await commerce.cartUpsert({
		cartId: cartCookie?.id,
		variantId,
		quantity,
	});

	if (!cart) {
		return { success: false, cart: null };
	}

	await setCartCookie({ id: cart.id });

	// Fetch full cart data to sync with client
	const fullCart = await commerce.cartGet({ cartId: cart.id });

	return { success: true, cart: fullCart };
}

export async function removeFromCart(variantId: string) {
	if (!hasApiKey) {
		return { success: true, cart: null };
	}

	const cartCookie = await getCartCookieJson();
	const commerce = getCommerce();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		// Set quantity to 0 to remove the item
		await commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		});

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}

// Set absolute quantity for a cart item
// Calculates delta internally since cartUpsert uses delta behavior
export async function setCartQuantity(variantId: string, quantity: number) {
	if (!hasApiKey) {
		return { success: true, cart: null };
	}

	const cartCookie = await getCartCookieJson();
	const commerce = getCommerce();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	try {
		// Get current cart to calculate delta
		const currentCart = await commerce.cartGet({ cartId: cartCookie.id });
		const currentItem = currentCart?.lineItems?.find((item) => item.productVariant.id === variantId);
		const currentQuantity = currentItem?.quantity ?? 0;

		if (quantity <= 0) {
			// Remove item by setting quantity to 0
			await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: 0 });
		} else {
			// Calculate delta for cartUpsert
			const delta = quantity - currentQuantity;
			if (delta !== 0) {
				await commerce.cartUpsert({ cartId: cartCookie.id, variantId, quantity: delta });
			}
		}

		// Fetch updated cart
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { success: true, cart };
	} catch {
		return { success: false, cart: null };
	}
}
