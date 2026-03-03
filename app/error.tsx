"use client";

import { AlertCircleIcon } from "lucide-react";
import { YnsLink } from "@/components/yns-link";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	// Handle the reset without passing the function through props
	const handleReset = () => {
		try {
			reset();
		} catch (e) {
			// If reset fails, reload the page
			window.location.reload();
		}
	};

	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<AlertCircleIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-7xl font-bold tracking-tight">Error</h1>
			<h2 className="mt-4 text-xl text-muted-foreground">Something went wrong</h2>
			<p className="mt-2 text-sm text-muted-foreground">
				An unexpected error occurred. Please try again or return to the store.
			</p>
			<div className="mt-8 flex items-center gap-4">
				<YnsLink
					href="/"
					className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
				>
					Continue Shopping
				</YnsLink>
			</div>
		</div>
	);
}
