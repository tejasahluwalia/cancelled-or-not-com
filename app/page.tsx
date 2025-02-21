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
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WikiSearchResult {
	id: number;
	key: string;
	title: string;
	excerpt: string;
	description: string;
	thumbnail?: {
		url: string;
	};
}

export default function CelebrityDirectory() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<WikiSearchResult[]>([]);
	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">Celebrity Directory</h1>
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
											src={result.thumbnail?.url || "/placeholder.svg"}
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
