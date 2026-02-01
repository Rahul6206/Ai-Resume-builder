const axios = require("axios");

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

const MAX_RETRIES = 5; 
const BASE_DELAY_MS = 1000; 

async function generateWithGemini(prompt) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            };
            const response = await axios.post(
                `${GEMINI_URL}?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    timeout: 30000
                }
            );

            const text =
                response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("Empty response from Gemini");
            return text;

        } catch (err) {
            const isRateLimit = err.response && err.response.status === 429;

            const errorStatus = err.response ? `Status ${err.response.status}` : 'Network Error';
            console.warn(`Gemini attempt ${attempt}/${MAX_RETRIES} failed (${errorStatus}).`);

            if (isRateLimit && attempt < MAX_RETRIES) {
                const exponentialDelay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
                const jitter = Math.random() * BASE_DELAY_MS;
                const delay = exponentialDelay + jitter;

                console.warn(`Retrying in ${Math.round(delay / 1000)}s...`);

                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error(`Gemini failed after ${attempt} attempts. Final error:`, err.message);
                throw err;
            }
        }
    }
}

function safeExtractJSON(text) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini did not return parsable JSON");
    const clean = jsonMatch[0]
        .replace(/[\u0000-\u001F]+/g, "")
        .trim();
    return JSON.parse(clean);
}

module.exports = { generateWithGemini, safeExtractJSON };