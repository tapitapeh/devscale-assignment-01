// 02 - Simple Idea Review Board
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import {
  ANALYST_INSTRUCTION,
  CEO_INSTRUCTION,
  CTO_INSTRUCTION,
  FINAL_REVIEW_INSTRUCTION,
  generateReview,
} from "./services-02.js";

const InputSchema = z.object({
  idea: z.string(),
});

const IdeaReviewPipeline = new Pipeline({
  id: "get-role",
  inputSchema: InputSchema,
})
  .step({
    id: "generate-review",
    run: async (context) => {
      const ceoReview = await generateReview(
        context.input.idea,
        CEO_INSTRUCTION,
      );
      const analystReview = await generateReview(
        context.input.idea,
        ANALYST_INSTRUCTION,
      );
      const ctoReview = await generateReview(
        context.input.idea,
        CTO_INSTRUCTION,
      );

      return {
        ceoReview,
        analystReview,
        ctoReview,
      };
    },
  })
  .step({
    id: "final-review",
    run: async (context) => {
      const PERSPECTIVE_REVIEWS = `
        CEO Review:
        <ceo-review>
          ${context.input.ceoReview}
        </ceo-review>

        Analyst Review:
        <analyst-review>
          ${context.input.analystReview}
        </analyst-review>

        CTO Review:
        <cto-review>
          ${context.input.ctoReview}
        </cto-review>
      `;

      const finalReview = await generateReview(
        PERSPECTIVE_REVIEWS,
        FINAL_REVIEW_INSTRUCTION,
      );

      return finalReview;
    },
  });

const result = await IdeaReviewPipeline.run({
  input: {
    idea: "satu alat yang dipasang di keran untuk bisa menghemat air wudu",
  },
});

console.log(result);
