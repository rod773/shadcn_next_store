import { cookies } from "next/headers";

const CART_COOKIE_NAME = "yns_cart";

type CartCookieJson = {
	id: string;
};

function isCartCookieJson(value: unknown): value is CartCookieJson {
	if (!value || typeof value !== "object") {
		return false;
	}

	return "id" in value && typeof (value as { id?: unknown }).id === "string";
}

export async function getCartCookieJson(): Promise<CartCookieJson | null> {
	const store = await cookies();
	const raw = store.get(CART_COOKIE_NAME)?.value;

	if (!raw) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		return isCartCookieJson(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export async function setCartCookie(value: CartCookieJson): Promise<void> {
	const store = await cookies();
	store.set(CART_COOKIE_NAME, JSON.stringify(value), {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 30,
	});
}
