import axios from 'axios';

const model = 'gemini-pro';

const API_URL = 'https://api.example.com/ai';

async function getStudyAdvice(userInput) {
    try {
        const response = await axios.post(`${API_URL}/advice`, {
            model,
            input: userInput
        });
        return response.data.advice;
    } catch (error) {
        console.error('Error getting study advice:', error);
        return 'Sorry, we could not provide study advice at this time. Please try again later.';
    }
}

async function generateStudyPlan(userGoals) {
    try {
        const response = await axios.post(`${API_URL}/generate-plan`, {
            model,
            goals: userGoals
        });
        return response.data.studyPlan;
    } catch (error) {
        console.error('Error generating study plan:', error);
        return 'Sorry, we could not generate a study plan at this moment. Please try again later.';
    }
}

async function analyzePerformance(userData) {
    try {
        const response = await axios.post(`${API_URL}/performance`, {
            model,
            data: userData
        });
        return response.data.performanceAnalysis;
    } catch (error) {
        console.error('Error analyzing performance:', error);
        return 'Sorry, we could not analyze your performance at this time. Please try again later.';
    }
}

export { getStudyAdvice, generateStudyPlan, analyzePerformance };