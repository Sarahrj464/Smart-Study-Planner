// frontend/src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY in your .env file");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Use 'gemini-pro' as it is the most widely available stable model for this API version.
// If you encounter specific model errors, check the API key permissions.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ─── 1. Study Advice ───────────────────────────────────────────────────────────
export async function getStudyAdvice(userContext) {
  try {
    const prompt = `
You are a helpful and encouraging AI study coach for students.

Student's question: "${userContext.question}"

Additional context:
- Upcoming tasks: ${userContext.tasks?.length || 0} tasks pending
- Exams: ${userContext.exams || "None upcoming"}
- Study hours today: ${userContext.hoursToday || 0} hours

Please provide a helpful, concise response with:
1. A brief encouraging intro
2. 3-4 practical bullet points
3. A motivating closing line

Keep response under 200 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (getStudyAdvice):", error);
    throw error;
  }
}

// ─── 2. Study Plan ────────────────────────────────────────────────────────────
export async function generateStudyPlan(tasks, examDate, targetHours) {
  try {
    const prompt = `
Create a 7-day study schedule.
Tasks: ${JSON.stringify(tasks?.slice(0, 5) || [])}
Exam Date: ${examDate}
Daily Study Hours Available: ${targetHours}

Return ONLY valid JSON, no markdown, no extra text:
{
  "schedule": [
    {
      "day": "Day 1",
      "tasks": [
        { "subject": "Math", "time": "2 hours", "topic": "Chapter Review" }
      ]
    }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Service Error (generateStudyPlan):", error);
    throw error;
  }
}

// ─── 3. Performance Analysis ──────────────────────────────────────────────────
export async function analyzePerformance(completedTasks, studyHours) {
  try {
    const prompt = `
Analyze this student's study performance:
- Tasks completed: ${completedTasks}
- Total study hours: ${studyHours}

Return ONLY valid JSON, no markdown, no extra text:
{
  "rating": 7,
  "strengths": ["Good consistency", "Task completion"],
  "improvements": ["Need more focus time", "Review weak subjects"],
  "recommendations": ["Use Pomodoro technique", "Study hardest subject first", "Review notes daily"]
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Service Error (analyzePerformance):", error);
    throw error;
  }
}