import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    // We will scrape Eiga.com for exact Japanese matches
    const eigaUrl = `https://eiga.com/search/${encodeURIComponent(q)}/`;
    const res = await fetch(eigaUrl, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
      next: { revalidate: 3600 * 24 } // cache for 1 day
    });

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      
      // Find the first image that belongs to a movie poster on Eiga.com
      const firstMovieImg = $('img').filter((i, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src') || '';
        // Posters usually have 'images/movie' in the path
        return src.includes('/images/movie/');
      }).first();

      let posterUrl = firstMovieImg.attr('data-src') || firstMovieImg.attr('src');

      if (posterUrl) {
        // Remove trailing queries like ?v=... to get the raw high-res image
        posterUrl = posterUrl.split('?')[0];
        // Upgrade low-res thumbnail to slightly higher
        posterUrl = posterUrl.replace('/160.jpg', '/320.jpg');
        return NextResponse.json({ url: posterUrl });
      }
    }

    // Fallback back to IMDb suggestion API if Eiga.com fails
    const cleanQ = q.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
    const firstLetter = cleanQ.charAt(0).match(/[a-z0-9]/) ? cleanQ.charAt(0) : 'x';
    const imdbUrl = `https://v3.sg.media-imdb.com/suggestion/${firstLetter}/${cleanQ}.json`;
    
    const imdbRes = await fetch(imdbUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (imdbRes.ok) {
      const imdbData = await imdbRes.json();
      const movie = imdbData.d?.find((item: any) => (item.qid === "movie" || !item.qid) && item.i?.imageUrl);
      if (movie) {
        return NextResponse.json({ url: movie.i.imageUrl });
      }
    }
    
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("Poster fetch error:", error);
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}
