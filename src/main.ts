import { pullWebpage } from "./pull-data/utils/pull-webpage";
import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { spawn } from 'node:child_process';
import { pullYouTubeTranscript } from "./pull-data/utils/pull-youtube";

const vaultDir = '/home/ln64/Documents/ln64-vault/Daily Research';
const lastUrlFile = path.join(vaultDir, '.last-url.txt');

export async function main(url: string) {
  // const lastUrl = await getLastUrl();
  // if (lastUrl === url.trim()) {
  //   console.log("This URL is the same as the last one. Skipping.");
  //   return;
  // }

  // console.log("Pulling data into notes...");

  let bodyText: string;
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) {
    console.log("Detected YouTube video...");
    const youtubeIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : undefined;
    if (!youtubeId) {
      throw new Error("Could not extract YouTube video ID from the URL.");
    }
    const transcript = await pullYouTubeTranscript(youtubeId);
    bodyText = transcript;
  } else {
    console.log("Detected regular webpage...");
    bodyText = await pullWebpage(url);
  }

  // await saveLastUrl(url);
  console.log("bodyText: ", bodyText);
  await saveDataToClipboard(bodyText);
  // await saveDataToVault(`${bodyText}`);
  // await saveDataToVault(`---`);
  console.log("Saved to vault.");
}


export async function saveDataToClipboard(data: string): Promise<void> {
  let command: string;
  let args: string[] = [];

  if (process.env.XDG_SESSION_TYPE === 'wayland') {
    command = 'wl-copy';
    // No additional args needed for wl-copy
  } else {
    command = 'xclip';
    args = ['-selection', 'clipboard'];
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn ${command}: ${err.message}. Please install ${command === 'xclip' ? 'xclip' : 'wl-clipboard'} on your system.`));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log("Data saved to clipboard.");
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });

    proc.stdin.write(data);
    proc.stdin.end();
  });
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
