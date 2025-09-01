import { pullData } from "./pull-data/pull-data";
import { saveDataToClipboard } from "./pull-data/utils/clipboard";
import { formatData } from "./pull-data/utils/format-data";

if (Bun.main) {
  const input = Bun.argv[2];
  if (!input) {
    console.error("❌ No input provided.");
    process.exit(1);
  }

  let pulled: string = input;
  let final: string = input;

  try {
    if (/^https?:\/\//.test(input)) {
      console.log(`Detected URL input: ${input}`);
      pulled = await pullData(input);
      console.log("Pulled data from URL.");
      final = await formatData(pulled);
      console.log("Formatted pulled data.");
    } else if (input.length > 100) {
      console.log("Detected long input, formatting directly.");
      final = await formatData(input);
      console.log("Formatted input data.");
    }

    const combinedOutput = `# Pulled Content:\n\n${pulled}\n\n# Final Output:\n\n${final}`;
    console.log("Saving combined output to clipboard...");
    await saveDataToClipboard(combinedOutput);

    console.log("✅ Pulled and formatted data copied to clipboard.");
  } catch (error) {
    console.error("❌ Uncaught error:", error);
    process.exit(1);
  }
}
