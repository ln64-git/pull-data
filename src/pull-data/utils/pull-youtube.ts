import { Innertube, UniversalCache } from 'youtubei.js';

export async function pullYouTubeTranscript(videoId: string): Promise<string> {
  try {
    const youtube = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });

    const video = await youtube.getInfo(videoId);
    const transcript = await video.getTranscript();

    if (!transcript || !transcript.transcript?.content?.body?.initial_segments) {
      throw new Error('No transcript available');
    }

    const transcriptText = transcript.transcript.content.body.initial_segments
      .map((segment: { type: string; snippet?: { text?: string } }) =>
        segment.type === 'TranscriptSegment' && segment.snippet?.text ? segment.snippet.text : undefined
      )
      .filter((text: string | undefined): text is string => !!text && text.trim() !== '')
      .join(' ');

    if (!transcriptText) {
      throw new Error('Empty transcript');
    }

    return transcriptText;
  } catch {
    throw new Error(`Failed to fetch transcript for video ${videoId}`);
  }
}