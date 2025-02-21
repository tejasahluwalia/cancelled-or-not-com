import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// This would normally come from your database
async function getCelebrity(id: string) {
  // Example data matching the schema
  return {
    id: "Q12345",
    name: "John Smith",
    occupation: "Actor, Director",
    image_url: "/placeholder.svg?height=600&width=600",
    controversy: `Multiple controversies surrounding creative decisions and public statements about industry practices have emerged over the past year. 
    
    The incidents began in early 2023 when Smith made several controversial statements about industry practices during the Writers Guild strike. This was followed by creative disputes with several major studios, leading to the cancellation of two major projects.
    
    In response to these events, Smith issued a statement through his representatives addressing the concerns and announcing his decision to focus on independent productions.`,
    sources: JSON.stringify([
      {
        url: "https://example.com/news/article1",
        title: "Industry Responds to John Smith's Controversial Statements",
        publisher: "Entertainment Weekly",
        date: "2023-06-15",
      },
      {
        url: "https://example.com/news/article2",
        title: "Studio Cancels Project Following Creative Disputes",
        publisher: "Variety",
        date: "2023-08-22",
      },
      {
        url: "https://example.com/news/article3",
        title: "John Smith's Official Statement on Recent Controversies",
        publisher: "The Hollywood Reporter",
        date: "2023-09-10",
      },
    ]),
    last_checked: "2024-02-20T12:00:00Z",
  }
}

export default async function CelebrityPage({ params }: { params: { id: string } }) {
  const celebrity = await getCelebrity(params.id)
  const sources = JSON.parse(celebrity.sources)

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
                  src={celebrity.image_url || "/placeholder.svg"}
                  alt={celebrity.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{celebrity.name}</CardTitle>
                  <p className="text-lg text-muted-foreground">{celebrity.occupation}</p>
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
              {celebrity.controversy.split("\n\n").map((paragraph, index) => (
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
              {sources.map((source: any, index: number) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-6" />}
                  <div className="space-y-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-primary hover:underline flex items-center gap-2"
                    >
                      {source.title}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{source.publisher}</span>
                      <span>•</span>
                      <span>
                        {new Date(source.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground text-right">
          Last updated:{" "}
          {new Date(celebrity.last_checked).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}

