import { Commerce } from "commerce-kit";
import { cache } from "react";

type CommerceClient = ReturnType<typeof Commerce>;

function createDisabledCommerce(): CommerceClient {
	const noop = async () => null;

	const demoProducts = [
		{
			id: "demo-1",
			slug: "demo-product-1",
			name: "Demo Product One",
			summary: "Example product shown without API connectivity.",
			images: ["/1.jpg", "/2.jpg"],
			variants: [
				{
					id: "demo-1-default",
					price: "1999",
					stock: 10,
					images: ["/1.jpg", "/2.jpg"],
					combinations: [],
					attributes: [],
				},
			],
		},
		{
			id: "demo-2",
			slug: "demo-product-2",
			name: "Demo Product Two",
			summary: "Replace with your own products and images.",
			images: ["/3.jpg", "/4.jpg"],
			variants: [
				{
					id: "demo-2-default",
					price: "2999",
					stock: 8,
					images: ["/3.jpg", "/4.jpg"],
					combinations: [],
					attributes: [],
				},
			],
		},
		{
			id: "demo-3",
			slug: "demo-product-3",
			name: "Demo Product Three",
			summary: "Uses assets from the public folder.",
			images: ["/5.jpg", "/6.jpg"],
			variants: [
				{
					id: "demo-3-default",
					price: "3999",
					stock: 5,
					images: ["/5.jpg", "/6.jpg"],
					combinations: [],
					attributes: [],
				},
			],
		},
	];

	let demoCart: {
		id: string;
		lineItems: {
			id: string;
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
		}[];
	} | null = null;

	const disabled = {
		cartGet: async () => demoCart,
		cartUpsert: async ({
			cartId,
			variantId,
			quantity,
		}: {
			cartId?: string;
			variantId: string;
			quantity: number;
		}) => {
			const product = demoProducts.find((p) => p.variants.some((v) => v.id === variantId));
			const variant = product?.variants.find((v) => v.id === variantId);

			if (!product || !variant) {
				return demoCart;
			}

			if (!demoCart) {
				demoCart = { id: cartId ?? "demo-cart", lineItems: [] };
			}

			const existing = demoCart.lineItems.find((item) => item.productVariant.id === variantId);

			if (quantity === 0) {
				demoCart.lineItems = demoCart.lineItems.filter((item) => item.productVariant.id !== variantId);
			} else if (existing) {
				existing.quantity += quantity;
				if (existing.quantity <= 0) {
					demoCart.lineItems = demoCart.lineItems.filter((item) => item.productVariant.id !== variantId);
				}
			} else if (quantity > 0) {
				demoCart.lineItems.push({
					id: `li-${variantId}`,
					quantity,
					productVariant: {
						id: variant.id,
						price: variant.price,
						images: variant.images,
						product: {
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images,
						},
					},
				});
			}

			return demoCart;
		},
		collectionGet: async () => ({
			id: "demo-collection",
			name: "Demo Collection",
			description: "Products using local images instead of the API.",
			image: "/7.jpg",
			productCollections: demoProducts.map((product) => ({
				id: `pc-${product.id}`,
				product,
			})),
		}),
		legalPageGet: noop,
		orderGet: noop,
		productGet: async ({ idOrSlug }: { idOrSlug: string }) =>
			demoProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null,
		subscriberCreate: noop,
		collectionBrowse: async () => ({
			data: [
				{
					id: "demo-collection",
					name: "Demo Collection",
					image: "/8.jpg",
					createdAt: new Date().toISOString(),
					slug: "demo-collection",
					active: true,
					description: "Example collection rendered without an API key.",
					productCollections: demoProducts.map((product) => ({
						productId: product.id,
					})),
				},
			],
			meta: { count: 1 },
		}),
		legalPageBrowse: async () => ({ data: [], meta: { count: 0 } }),
		productBrowse: async () => ({
			data: demoProducts.map((product) => ({
				...product,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				type: "product" as const,
				status: "published" as const,
				flags: null,
				storeId: "demo-store",
				subscriptionPlanProducts: [],
			})),
			meta: { count: demoProducts.length },
		}),
		meGet: async () => ({
			store: { subdomain: "store" },
			publicUrl: "https://yournextstore.com",
			storeBaseUrl: "https://yournextstore.com",
		}),
	} satisfies Partial<CommerceClient>;

	return new Proxy(disabled as unknown as CommerceClient, {
		get(target, prop) {
			const value = Reflect.get(target, prop) as unknown;
			if (value !== undefined) {
				return value;
			}
			return noop;
		},
	});
}

export const getCommerce = cache((token = process.env.YNS_API_KEY) => {
	if (!token) {
		return createDisabledCommerce();
	}

	return Commerce({ token });
});

const meGetCached = async (token?: string) => {
	"use cache: remote";

	return getCommerce(token).meGet();
};

export const getSubdomainPublicUrl = async () => {
	const tenant = process.env.NEXT_PUBLIC_YNS_API_TENANT;
	if (tenant) {
		const tenantHost = new URL(tenant).host;
		const [subdomain, ...base] = tenantHost.split(".");
		const apiHost = base.join(".");
		if (subdomain && apiHost) {
			return {
				subdomain,
				publicUrl: `https://${apiHost}`,
			};
		}
	}

	if (!process.env.YNS_API_KEY) {
		return { subdomain: "store", publicUrl: "https://yournextstore.com" };
	}

	// fallback to fetching from the API if env variable is not set or invalid
	const {
		store: { subdomain },
		publicUrl,
	} = await meGetCached(process.env.YNS_API_KEY);
	return { subdomain, publicUrl };
};
