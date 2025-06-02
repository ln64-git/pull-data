import { pullWebpage } from "./pull-data/utils/pull-webpage";
import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { pullYoutubeTranscript } from "./pull-data/utils/pull-youtube";

const vaultDir = '/home/ln64/Documents/ln64-vault/Daily Research';
const lastUrlFile = path.join(vaultDir, '.last-url.txt');

export async function main(url: string) {
  // const lastUrl = await getLastUrl();
  // if (lastUrl === url.trim()) {
  //   console.log("This URL is the same as the last one. Skipping.");
  //   return;
  // }

  console.log("Pulling data into notes...");

  let bodyText: string;
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) {
    console.log("Detected YouTube video...");
    const transcript = await pullYoutubeTranscript(url);
    bodyText = transcript;
  } else {
    console.log("Detected regular webpage...");
    bodyText = await pullWebpage(url);
  }

  await saveDataToVault(`${bodyText}`);
  await saveLastUrl(url);
  await saveDataToVault(`---`);
  console.log("Saved to vault.");
}


export async function saveDataToVault(data: string): Promise<void> {
  const filename = `${format(new Date(), 'yyyy-MM-dd')}.md`;
  const filePath = path.join(vaultDir, filename);

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, `# ${filename.replace('.md', '')}\n\n`);
  }
  const formattedData = `${data.trim()}\n\n`;
  await fs.appendFile(filePath, formattedData);
}

async function saveLastUrl(url: string): Promise<void> {
  await fs.writeFile(lastUrlFile, url.trim());
}

if (Bun.main) {
  const url = Bun.argv[2];
  if (!url) {
    console.error("Please provide a URL as an argument.");
    process.exit(1);
  }

  main(url).catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
}
