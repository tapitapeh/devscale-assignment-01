// 03 - Ticket Triage
// 1. Input the task
// 2. AI will prioritize the ticket (LOW/MEDIUM/HIGH)
import { generateCompletion } from "@anvia/core";
import z from "zod";
import { model } from "./models.js";
import { Pipeline } from "@anvia/core/pipeline";
import { Studio } from "@anvia/studio";

const prioritySchema = z.object({
  tasks: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    }),
  ),
});

const taskSchema = z.object({
  task: z.array(z.string()).default({
    task: [
      "Validasi format dan panjang payload pitch sebelum diproses pipeline",
      "Perbaiki typo kecil pada label tombol CTA di dashboard",
      "Implementasi circuit breaker saat inferensi model pihak ketiga down",
      "Ubah warna border badge status review board agar lebih kontras",
      "Enkripsi credential API keys provider LLM di environment database",
      "Buat template export summary board ke format PDF/Markdown",
      "Atur retry logic dengan exponential backoff untuk branch evaluasi yang timeout",
      "Tambahkan tooltip penjelasan singkat pada metrik TAM/SAM/SOM",
      "Normalisasi scoring matrix dari ketiga reviewer menjadi format skala 1-100",
      "Perbaiki kebocoran memori pada worker background task",
      "Update teks copyright di bagian footer aplikasi ke tahun terbaru",
      "Audit latency response fan-out agar tidak melebihi ambang 10 detik",
      "Sediakan fallback response default jika branch Analyst gagal merespons",
      "Ganti icon loading spinner di branch view dengan skeleton shimmer",
      "Tambahkan rate limiting per user tier untuk endpoint submission pitch",
      "Rapikan indentation dan spacing pada file konfigurasi environment",
      "Pastikan data transaksi audit log tercatat konsisten sebelum merge verdict",
      "Sediakan opsi copy-to-clipboard untuk ringkasan catatan CTO",
      "Mitigasi celah prompt injection pada field value proposal startup",
      "Sesuaikan padding card review board pada resolusi layar mobile",
    ],
  }),
});

const INSTRUCTIONS = `
     Classify every task as LOW, MEDIUM, or HIGH priority.
     Include every provided task exactly once.
   `;

const pipeline = new Pipeline({
  id: "get-priority",
  inputSchema: taskSchema,
}).step({
  id: "prioritizing",
  run: async (context) => {
    const priorityResult = await generateCompletion({
      model: model,
      instructions: INSTRUCTIONS,
      prompt: `Tasks:\n${context.input.task.map((task) => `- ${task}`).join("\n")}`,
      outputSchema: prioritySchema,
    });

    for (const item of priorityResult.output.tasks) {
      console.log(`- ${item.priority} - ${item.task}`);
    }

    return priorityResult.output.tasks;
  },
});

new Studio([pipeline]).start();
