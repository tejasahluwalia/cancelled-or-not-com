import { NextResponse } from "next/server";

export type WikiTitleSearchResult = {
	id: number;
	key: string;
	title: string;
	excerpt: string;
	matched_title: string | null;
	description: string;
	thumbnail: {
		mimetype: string;
		width: number;
		height: number;
		duration: number;
		url: string;
	} | null;
};

interface WikiTitleSearchResultResponse {
	pages: WikiTitleSearchResult[];
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("q");

	if (!query) return NextResponse.json([]);

	// Search Wikipedia
	const wikiRes = await fetch(
		`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(
			query
		)}&limit=10`,
		{
			headers: {
				"User-Agent": "tejas@tujux.com",
			},
		}
	);
	if (!wikiRes.ok) {
		console.error("Wikipedia search failed:", wikiRes.status);
		return NextResponse.json({
			error: "Wikipedia search failed",
			status: wikiRes.status,
		});
	}
	const wikiData = (await wikiRes.json()) as WikiTitleSearchResultResponse;
	const results = wikiData.pages.filter((page) => Boolean(page.thumbnail));

	return NextResponse.json(results);
}
