import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch('https://eiga.com/now/all/rank/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error("Failed to fetch from eiga.com");
    
    const html = await res.text();
    // Use regex to find titles in the ranking
    const matches = [...html.matchAll(/<h[23][^>]*><a[^>]*>(.*?)<\/a><\/h[23]>/g)];
    
    const titles = matches
      .slice(0, 10) // Top 10
      .map(m => m[1]
        // Clean up entities if any
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
      );
      
    // Deduplicate just in case
    const uniqueTitles = Array.from(new Set(titles));

    return NextResponse.json({ titles: uniqueTitles });
  } catch (error) {
    console.error("Now Playing fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch now playing movies" }, { status: 500 });
  }
}
