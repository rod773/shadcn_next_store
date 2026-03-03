import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { ProductClientWrapper } from "@/app/product/[slug]/product-client-wrapper";
import { getCommerce } from "@/lib/commerce";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
	"use cache";
	cacheLife("minutes");

	return <ProductDetails params={props.params} />;
}

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const commerce = getCommerce();
	const product = await commerce.productGet({ idOrSlug: slug });

	if (!product) {
		notFound();
	}

	return <ProductClientWrapper product={product} />;
};
