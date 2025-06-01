import { YoutubeTranscript } from 'youtube-transcript';
import { decode } from 'he';

export async function pullYoutubeTranscript(url: string): Promise<string> {
  const raw = await YoutubeTranscript.fetchTranscript(url);

  const text = raw
    .map((item: any) => decode(item.text))
    .join(' ');

  return text.trim();
}
