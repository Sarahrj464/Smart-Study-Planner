const express = require('express');
const router = express.Router();

// Note: Node.js 18+ has built-in fetch. If on older version, this might need node-fetch.
// We'll use a dynamic check or assume built-in fetch for modern environments.

router.post('/chat', async (req, res) => {
    try {
        const { question, tasks, exams, hoursToday } = req.body;

        const systemPrompt = `You are an encouraging AI study coach for the "StudyPulse" platform. 
Keep responses concise, helpful, and motivational.
Context:
- Upcoming Tasks: ${JSON.stringify(tasks || [])}
- Upcoming Exams: ${exams || 'None'}
- Hours Studied Today: ${hoursToday || 0}
Provide: 1 intro + 3 specific tips + 1 motivational line. Max 150 words.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "StudyPulse Smart Planner"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question || "How should I study today?" }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "OpenRouter Error");
        }

        res.json({
            success: true,
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error("AI Proxy Error:", error);
        res.status(500).json({
            success: false,
            reply: "❌ AI Study Coach is temporarily unavailable. Please try again later.",
            error: error.message
        });
    }
});

module.exports = router;
