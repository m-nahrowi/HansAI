import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyDZaSrgX4GUGvQFceumHMA0sq2qyUOwdjY";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function runChat(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [],
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        console.log("Response from chatSession:", result);
        // Extract the response text from the result object
        const responseText = result.response.text();
        console.log("Extracted response text:", responseText);
        return responseText; // Return the extracted response text
    } catch (error) {
        console.error("Error in runChat:", error);
        throw error;
    }
}

export default runChat;
