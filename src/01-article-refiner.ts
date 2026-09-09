import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { Studio } from "@anvia/studio";
import { generateCritique, generateRefinedArticle } from "./services.js";

const ArticleInputSchema = z.object({
  draft: z.string(),
});

// Simple Article Refiner
// 1. Get draft
// 2. Send to AI to get Critique
// 3. Output the refined result from AI

const getRefinedArticle = new Pipeline({
  id: "article",
  inputSchema: ArticleInputSchema,
})
  .step({
    // Critique
    id: "draft",
    run: async (context) => {
      const draft = context.input.draft;
      const critique = await generateCritique(draft);
      return { draft, critique };
    },
  })
  .step({
    id: "refined-article",
    run: async (context) => {
      console.log(context.input);
      const draft = context.input.draft;
      const critique = context.input.critique;
      const refined = await generateRefinedArticle(draft, critique);
      console.log(refined);
      return { draft, critique, refined };
    },
  });

new Studio([getRefinedArticle]).start();
