import { pullWebpage } from '@/pull-data/utils/pull-webpage';
import { describe, it, expect } from 'vitest';

const articleURL = "https://www.youtube.com/watch?v=_EcbU83Mrd4";

describe('pullWebpage', () => {
  it('should pull text from webpage', async () => {
    const expected = "This is going to be a quick overview of how I tend to write my application code. It might be a bit Rust-centric, but I apply similar methods in all programming languages I use.";
    const transcript = await pullWebpage(articleURL);
    expect(transcript).toContain(expected);
  });
});
