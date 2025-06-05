// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { extractTextFromImage } = require('./01-ocr');         // Updated path
const { getExplanationWithFallback } = require('./02-llm');   // Updated path

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("AI Learning App Backend is Running!");
});

app.post('/photo-explain', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Missing image URL" });
    }

    const rawText = await extractTextFromImage(imageUrl);
    if (!rawText) {
        return res.status(500).json({ error: "Could not extract text from image." });
    }

    const prompt = `Explain this clearly and simply:\n\n${rawText}`;
    const explanation = await getExplanationWithFallback(prompt);

    res.json({
        extracted_text: rawText,
        explanation: explanation
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});