import { Gemini } from 'gemini-pro';

const geminiClient = new Gemini({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = async (input) => {
    try {
        const response = await geminiClient.generate({
            prompt: input,
            model: 'gemini-pro',
            maxTokens: 150,
        });
        return response;
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Failed to generate response from Gemini AI');
    }
};
