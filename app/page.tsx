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

interface Celebrity {
	id: string;
	name: string;
	occupation: string;
	image_url: string;
	controversy: string;
	sources: string; // JSON array of sources
	last_checked: string;
}

export default function CelebrityDirectory() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredCelebrities, setFilteredCelebrities] = useState<Celebrity[]>(
		[]
	);
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
				{filteredCelebrities.map((celebrity) => (
					<Card key={celebrity.id}>
						<Link href={`/${celebrity.id}`}>
							<CardHeader>
								<div className="flex items-start gap-4">
									<div className="relative h-24 w-24 rounded-lg overflow-hidden shrink-0">
										<Image
											src={celebrity.image_url || "/placeholder.svg"}
											alt={celebrity.name}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<CardTitle>{celebrity.name}</CardTitle>
										<CardDescription>{celebrity.occupation}</CardDescription>
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
