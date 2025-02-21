import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db"

export async function POST(request: Request) {
	const { title } = await request.json();

	// Check existing
	const existing = await dbQuery(
        `SELECT * FROM celebrities WHERE name = '${title}'`
    )

	if (existing) return NextResponse.json(existing);

    const newCelebrity = {
        name: title,
        occupation: "Unknown",
        image_url: "https://example.com",
        controversy: "Unknown",
        sources: "[]",
        last_checked: new Date().toISOString()
    }

    await dbQuery(
        `INSERT INTO celebrities (name, occupation, image_url, controversy, sources, last_checked) VALUES ('${newCelebrity.name}', '${newCelebrity.occupation}', '${newCelebrity.image_url}', '${newCelebrity.controversy}', '${newCelebrity.sources}', '${newCelebrity.last_checked}')`
    )


	return NextResponse.json(newCelebrity);
}

function getAIAnalysis(celebrityName: string) {
    return "example"
}