import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Helper: mock summarizer (fallback logic)
function mockSummarize(text) {
  const sentences = text.split(/(?<=[.?!])\s+/); // split by sentence
  const summary = sentences.slice(0, 2).join(" "); // take first 2 sentences
  return summary || "Sorry, nothing to summarize.";
}

// POST route for summarization
app.post("/api/summarize", async (req, res) => {
  const inputText = req.body.text;

  if (!inputText || inputText.trim() === "") {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    // Try Cohere summarization
    const cohereResponse = await fetch("https://api.cohere.ai/v1/summarize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: inputText,
        length: "medium",
        format: "paragraph",
        model: "command",
        temperature: 0.3
      })
    });

    if (!cohereResponse.ok) {
      throw new Error(`Cohere error ${cohereResponse.status}`);
    }

    const result = await cohereResponse.json();
    return res.json({ summary: result.summary });
  } catch (error) {
    console.warn("Cohere failed, falling back to mock:", error.message);

    // Fallback to mock logic
    const mockSummary = mockSummarize(inputText);
    return res.json({ summary: mockSummary });
  }
});

app.listen(PORT, () => {
  console.log(`Summarizer backend running at http://localhost:${PORT}`);
});
