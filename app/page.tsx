"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type WikiTitleSearchResult } from "@/app/api/search/route";
import debounce from "lodash/debounce";
import { useEffect } from "react";

export default function CelebrityDirectory() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<WikiTitleSearchResult[]>(
		[]
	);

	const debouncedSearch = debounce(async (query: string) => {
		if (query.trim() === "") {
			setSearchResults([]);
			return;
		}

		try {
			const response = await fetch(
				`/api/search?q=${encodeURIComponent(query)}`
			);
			if (!response.ok) throw new Error("Search failed");
			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error("Search error:", error);
			setSearchResults([]);
		}
	}, 300);

	useEffect(() => {
		debouncedSearch(searchQuery);

		return () => {
			debouncedSearch.cancel();
		};
	}, [searchQuery, debouncedSearch]);

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">Cancelled or Not Directory</h1>
				<div className="relative">
					<SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search celebrities..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid gap-6">
				{searchResults.map((result) => (
					<Card key={result.key}>
						<Link href={`/${result.key}`}>
							<CardHeader>
								<div className="flex items-start gap-4">
									<div className="relative h-24 w-24 rounded-lg overflow-hidden shrink-0">
										<Image
											src={
												"https:" +
													result.thumbnail?.url.replace(
														/\/\d+px-/,
														"/500px-"
													) || "/placeholder.svg"
											}
											alt={result.title}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<CardTitle>{result.title}</CardTitle>
										<CardDescription>{result.description}</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Link>
					</Card>
				))}
			</div>
		</div>
	);
}
