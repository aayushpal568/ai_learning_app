// ocr.js
const Tesseract = require('tesseract.js');

async function extractTextFromImage(imageUrl) {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageUrl,
            'eng',
            {
                logger: m => {} // Hide logs
            }
        );
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        return null;
    }
}

module.exports = { extractTextFromImage };