// llm.js
const axios = require('axios');

async function getExplanationWithFallback(prompt) {
    const HF_TOKEN = process.env.HF_TOKEN; // Get from https://huggingface.co/settings/tokens 

    // Try Qwen first
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct", 
            {
                inputs: prompt,
                parameters: { max_new_tokens: 300 },
                options: { wait_for_model: true }
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data?.generated_text || "No explanation.";
        return result;
    } catch (error) {
        console.log("Qwen failed, trying Mistral...");
    }

    // Fallback to Mistral if Qwen fails
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", 
            {
                inputs: prompt,
                parameters: { max_new_tokens: 300 },
                options: { wait_for_model: true }
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data?.generated_text || "No explanation.";
        return result;
    } catch (error) {
        console.error("LLM Error:", error.message);
        return "Error getting AI response.";
    }
}

module.exports = { getExplanationWithFallback };