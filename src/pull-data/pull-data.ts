import { saveDataToClipboard } from "./utils/clipboard";
import { formatData } from "./utils/format-data";
import { pullWebpage } from "./utils/pull-webpage";
import { pullYouTubeTranscript } from "./utils/pull-youtube";

// TODO
// - This needs to work with multiple input sources

// Input Functions Needed
// - pullWebpage(url: string): Promise<string>
// - pullYouTubeTranscript(videoId: string): Promise<string>
// - pullTikTokTranscript(videoId: string): Promise<string>
// - pullInstagramTranscript(videoId: string): Promise<string>
// - pullTwitterTranscript(tweetId: string): Promise<string>
// - pullRedditTranscript(postId: string): Promise<string>

// this hould pull data from various sources

// should pull text from a website 
// should pull transcript from youtube
// - I need more examples of pulling data from different sources

// after pulling text, add new line then save to daily note 
// format YYYY-MM-DD.md
// /home/ln64/Documents/ln64-vault/Daily Notes/

export async function pullData(url: string): Promise<string> {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) {
    const youtubeId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (!youtubeId) throw new Error("Could not extract YouTube video ID from the URL.");
    return await pullYouTubeTranscript(youtubeId);
  } else {
    return await pullWebpage(url);
  }
}

