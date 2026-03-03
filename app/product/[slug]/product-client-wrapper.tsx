"use client";

import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { ImageGallery } from "@/app/product/[slug]/image-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

type UnifiedVariant = {
	id: string;
	price: string;
	images: string[];
	combinations: {
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: {
				id: string;
				type: "string" | "color";
				label: string;
			};
		};
	}[];
};

type Product = {
	id: string;
	name: string;
	slug: string;
	images: string[];
	summary?: string | null;
	variants: UnifiedVariant[];
};

type ProductClientWrapperProps = {
	product: Product;
};

export function ProductClientWrapper({ product }: ProductClientWrapperProps) {
	const allImages = product.images;
	const priceDisplay = formatMoney({
		amount: BigInt(product.variants[0]?.price || "0"),
		currency: CURRENCY,
		locale: LOCALE,
	});

	// Transform variants for ImageGallery (simplified structure)
	const galleryVariants = product.variants.map((variant) => ({
		id: variant.id,
		images: variant.images,
		combinations: variant.combinations.map((comb) => ({
			variantValue: {
				value: comb.variantValue.value,
				variantType: {
					label: comb.variantValue.variantType.label,
				},
			},
		})),
	}));

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				{/* Left: Image Gallery (sticky on desktop) */}
				<ImageGallery images={allImages} productName={product.name} variants={galleryVariants} />

				{/* Right: Product Details */}
				<div className="mt-8 lg:mt-0 space-y-8">
					{/* Title, Price, Description */}
					<div className="space-y-4">
						<h1 className="text-4xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
							{product.name}
						</h1>
						<p className="text-2xl font-semibold tracking-tight">{priceDisplay}</p>
						{product.summary && <p className="text-muted-foreground leading-relaxed">{product.summary}</p>}
					</div>

					{/* Variant Selector, Quantity, Add to Cart, Trust Badges */}
					<AddToCartButton
						variants={product.variants}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images,
						}}
					/>
				</div>
			</div>

			{/* Product Features */}
			<ProductFeatures />
		</div>
	);
}
