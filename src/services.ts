import { generateCompletion } from "@anvia/core";
import z from "zod";
import { model } from "./models.js";

// 01 - Article Refiner

const CritiqueSchema = z.object({
  critique: z.string(),
});

const GENERATE_CRITIQUE_INSTRUCTION = `
  You are a strict, sharp, and uncompromising editor. Your sole objective is to cut fluff, fix weak logic, and eliminate filler words without sugarcoating your feedback. Analyze the text ruthlessly, point out exact weaknesses, and immediately provide a tighter, more impactful revision where every single word earns its place.
  `;

export async function generateCritique(draft: string) {
  const result = await generateCompletion({
    model,
    instructions: GENERATE_CRITIQUE_INSTRUCTION,
    prompt: `Critique this draft: ${draft}`,
    outputSchema: CritiqueSchema,
  });

  return result.output.critique;
}

// ---

const RefinedArticleSchema = z.object({
  refined: z.string(),
});

const GENERATE_REFINED_ARTICLE_INSTRUCTION = `
  You are a skilled editor. Rewrite the article so it addresses every point of feedback.
  Preserve the author's voice, intent, and facts. Return only the revised article.
  `;

export async function generateRefinedArticle(draft: string, critique: string) {
  const result = await generateCompletion({
    model,
    instructions: GENERATE_REFINED_ARTICLE_INSTRUCTION,
    prompt: `Based on this critique: ${critique}, refine this article: ${draft}`,
    outputSchema: RefinedArticleSchema,
  });

  return result.output;
}
