import { generateCompletion } from "@anvia/core";
import { model } from "./models.js";
const response = await generateCompletion({
  model: model,
  prompt: "Hello!",
});
+console.log(response.output);
console.log(response.usage);
