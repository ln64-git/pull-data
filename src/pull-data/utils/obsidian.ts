import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
const vaultDir = '/home/ln64/Documents/ln64-vault/Daily Research';


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

if (Bun.main) {
  const url = Bun.argv[2];
  if (!url) {
    console.error("Please provide a URL as an argument.");
    process.exit(1);
  }

}
