import { YoutubeTranscript } from 'youtube-transcript';

const quickFoxVideo = "https://www.youtube.com/watch?v=_EcbU83Mrd4";
const lectureVideo = "https://www.youtube.com/watch?v=2ua4Ewb5MyU&pp=ygUPYWkgZGViYXRlIGp1bmcg0gcJCbAJAYcqIYzv";

describe('pull-youtube', () => {
  it('Should pull transcript from youtube video', async () => {
    const mockTranscript = "the quick brown fox jumps over the lazy dog";
    const transcriptSegments = await YoutubeTranscript.fetchTranscript(quickFoxVideo);
    const testTranscript = transcriptSegments
      .map(segment => segment.text)
      .join(' ')
      .replace(/\[.*?\]/g, '')
      .trim()
      .toLowerCase();
    expect(testTranscript).toContain(mockTranscript);
  });
});
