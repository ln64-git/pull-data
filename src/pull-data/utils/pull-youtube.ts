import { YoutubeTranscript } from 'youtube-transcript';
import { decode } from 'he';
import { request } from 'undici';
import * as cheerio from 'cheerio';

/**
 * Collapse malformed entities like &amp;#39; → &#39;
 */
function collapseAmp(text: string): string {
  return text.replace(/&amp;([#a-zA-Z0-9]+);/g, '&$1;');
}

/**
 * Recursively decode all HTML entities until stable
 */
function recursiveDecode(text: string): string {
  let prev: string;
  let current = text;
  let count = 0;
  do {
    prev = current;
    current = decode(current);
    count++;
  } while (current !== prev && count < 10);
  return current;
}

/**
 * Normalize whitespace
 */
function cleanWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Break paragraphs at sentence boundaries
 */
function addParagraphBreaks(text: string): string {
  return text.replace(/([.?!])\s+(?=[A-Z])/g, '$1\n\n');
}

/**
 * Scrape the YouTube page to get title and author
 */
async function fetchVideoMetadata(url: string): Promise<{ title: string; author: string }> {
  const { body } = await request(url);
  const html = await body.text();
  const $ = cheerio.load(html);

  const title = $('meta[name="title"]').attr('content') || $('title').text();
  const author =
    $('meta[itemprop="author"]').attr('content') ||
    $('link[itemprop="name"]').attr('content') ||
    $('[itemprop="author"] meta[itemprop="name"]').attr('content') ||
    'Unknown Author';

  return {
    title: title.trim(),
    author: author.trim(),
  };
}

/**
 * Pull, decode, clean and format transcript from YouTube
 */
export async function pullYoutubeTranscript(url: string): Promise<string> {
  const raw = await YoutubeTranscript.fetchTranscript(url);
  const { title, author } = await fetchVideoMetadata(url);

  const processed = raw.map((item) => {
    const collapsed = collapseAmp(item.text);
    return recursiveDecode(collapsed);
  });

  const flat = processed.join(' ');
  const cleaned = cleanWhitespace(flat);
  const withParagraphs = addParagraphBreaks(cleaned);

  const header = `# ${title}\n${url}\n**Channel:** ${author}\n\n`;

  return header + withParagraphs;
}
