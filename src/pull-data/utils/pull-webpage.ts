import { request } from 'undici';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

export async function pullWebpage(url: string): Promise<string> {
  const { body } = await request(url);
  const html = await body.text();

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) throw new Error("Could not extract readable content");

  // Convert the article content HTML to Markdown
  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
  });

  // Optional: Add GitHub-flavored markdown options
  turndownService.addRule('preToCodeBlock', {
    filter: ['pre'],
    replacement: (content) => {
      return `\n\`\`\`\n${content.trim()}\n\`\`\`\n`;
    }
  });

  const content = article.content ?? '';
  const markdown = turndownService.turndown(content);
  return markdown.trim();
}
