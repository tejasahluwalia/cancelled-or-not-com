import { NextResponse } from "next/server";

interface WikipediaTitleSearchResult {
	pages: {
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
	}[];
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
                "Api-User-Agent": "tejas@tujux.com"
            }
        }
	);
    if (!wikiRes.ok) {
        return NextResponse.error();
    }
	const wikiData = await wikiRes.json() as WikipediaTitleSearchResult;
    const results = wikiData.pages.filter((page: any) => Boolean(page.thumbnail));

	return NextResponse.json(results);
}
