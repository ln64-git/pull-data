import { llm } from "../lib/langchain";

export async function formatData(data: string, length?: number): Promise<string> {
  // remove all links and images
  const promptSteralize = `Remove all links and images from the following text.`;
  const promptStandardize = length ? `Summarize the following text to a maximum of ${length} words.` : "";
  const promptCore = `Format the following text into a markdown file. Do NOT include any code fences like \`\`\`markdown or \`\`\`. Only return raw markdown content.`;
  const finalPrompt = `${promptSteralize}\n\n${promptStandardize}\n\n${promptCore}\n\n ${data}`;
  console.log("Sending prompt to OpenAI...");
  const formattedData = await llm.invoke(finalPrompt);
  console.log("Got response from OpenAI.");
  const formattedText = formattedData.text.trim();
  return formattedText;
}
