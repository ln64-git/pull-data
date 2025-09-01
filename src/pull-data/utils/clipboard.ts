import { spawn } from "node:child_process";


export async function saveDataToClipboard(data: string): Promise<void> {
  if (typeof data !== "string") {
    throw new TypeError(`Expected clipboard data to be a string, but got: ${typeof data}`);
  }

  let command: string;
  let args: string[] = [];

  if (process.env.XDG_SESSION_TYPE === 'wayland') {
    command = 'wl-copy';
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
