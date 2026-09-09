import { OpenAIClient } from "@anvia/openai";
import "dotenv/config";

const client = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY!,
  baseUrl: process.env.OPENAI_BASE_URL,
});
// Model
export const model = client.completionModel({
  modelId: "gpt-5.6-luna",
  api: "chat",
});
