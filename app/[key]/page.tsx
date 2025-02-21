import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { perplexity } from "@ai-sdk/perplexity";
import { generateText } from "ai";
import { notFound } from "next/navigation";
import { dbQuery } from "@/lib/db";
import { WikiTitleSearchResult } from "../api/search/route";

export default async function Page({
	params,
}: {
	params: Promise<{ key: string }>;
}) {
	const { key } = await params;
	const entity = await getEntity(key);
	const sources = entity.sources;
	const controversy = entity.controversy;

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-6">
				<Link href="/">
					<Button variant="ghost" className="gap-2 pl-0 mb-4">
						<ChevronLeft className="h-4 w-4" />
						Back to Directory
					</Button>
				</Link>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row gap-6">
							<div className="relative w-full md:w-[300px] h-[400px] rounded-lg overflow-hidden">
								<Image
									src={entity.image_url || "/placeholder.svg"}
									alt={entity.name}
									fill
									className="object-cover"
									priority
								/>
							</div>
							<div className="flex-1">
								<div className="space-y-2">
									<CardTitle className="text-3xl">{entity.name}</CardTitle>
								</div>
							</div>
						</div>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Controversy Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="prose dark:prose-invert max-w-none">
							{controversy
								.split("\n\n")
								.map((paragraph: string, index: number) => (
									<p key={index} className="mb-4 text-muted-foreground">
										{paragraph}
									</p>
								))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Sources</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{sources.map((source: string, index: number) => (
								<div key={index}>
									{index > 0 && <Separator className="my-6" />}
									<div className="space-y-2">
										<a
											href={source}
											target="_blank"
											rel="noopener noreferrer"
											className="text-lg font-medium text-primary hover:underline flex items-center gap-2"
										>
											{source}
											<ExternalLink className="h-4 w-4" />
										</a>
										{/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
											<span>{source}</span>
											<span>•</span>
											<span>
												{new Date(source.date).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div> */}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="text-sm text-muted-foreground text-right">
					Last updated:{" "}
					{new Date(entity.last_checked).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</div>
			</div>
		</div>
	);
}

async function getAIAnalysis(entityName: string) {
	const { text, sources } = await generateText({
		model: perplexity("sonar"),
		prompt: `Is ${entityName} cancelled?`,
	});

	return {
		controversy: text,
		sources: sources,
	};
}

async function getEntity(key: string) {
	// Check existing
	const result = await dbQuery(`SELECT * FROM entities WHERE id = '${key}'`);

	if (result[0].results && result[0].results?.length > 0) {
		const entity = result[0].results[0] as {
			name: string;
			image_url: string;
			controversy: string;
			sources: string;
			last_checked: string;
		};

		if (
			entity.last_checked &&
			new Date(entity.last_checked).getTime() >
				Date.now() - 1000 * 60 * 60 * 24 * 7 * 4
		) {
			return {
				name: entity.name,
				image_url: entity.image_url.replace(/\/\d+px-/, "/500px-"),
				controversy: entity.controversy,
				sources: JSON.parse(entity.sources) as string[],
				last_checked: entity.last_checked,
			};
		}
	}

	const wikiData = await fetch(
		`https://en.wikipedia.org/w/rest.php/v1/search/page?q=${key}&limit=1`,
		{
			headers: {
				"User-Agent": "tejas@tujux.com",
			},
		}
	);
	if (!wikiData.ok) {
		console.error("Wikipedia search failed:", wikiData.status);
		notFound();
	}
	const wikiDataJson = (await wikiData.json())
		.pages[0] as WikiTitleSearchResult;
	const title = wikiDataJson.title;
	const imageUrl = wikiDataJson.thumbnail?.url.replace(/\/\d+px-/, "/500px-");

	const aiResult = await getAIAnalysis(title);
	const controversy = aiResult.controversy.replace(/'/g, "''");
	const sources = aiResult.sources;


	const newEntity = {
		key: key,
		name: title,
		image_url: "https:" + imageUrl,
		controversy: controversy,
		sources: sources.map((source) => source.url) as string[],
		last_checked: new Date().toISOString(),
	};

	await dbQuery(
		`INSERT INTO entities (id, name, image_url, controversy, sources, last_checked) VALUES ('${
			newEntity.key
		}', '${newEntity.name}','${newEntity.image_url}', '${
			newEntity.controversy
		}', '${JSON.stringify(newEntity.sources)}', '${
			newEntity.last_checked
		}') ON CONFLICT (id) DO UPDATE SET name = '${
			newEntity.name
		}', image_url = '${newEntity.image_url}', controversy = '${
			newEntity.controversy
		}', sources = '${JSON.stringify(newEntity.sources)}', last_checked = '${
			newEntity.last_checked
		}'`
	);

	return newEntity;
}
