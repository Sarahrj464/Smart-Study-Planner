const express = require('express');
const router = express.Router();

// ============================================
// CHAT ENDPOINT - Context Aware
// ============================================
router.post('/chat', async (req, res) => {
    try {
        const {
            question,
            tasks,
            exams,
            hoursToday,
            streak,
            urgentTasks
        } = req.body;

        // Build context summary from data
        const pendingTasks = tasks?.filter(t => !t.completed) || [];
        const completedTasks = tasks?.filter(t => t.completed) || [];
        const highPriority = pendingTasks.filter(t => t.priority === 'High' || t.priority === 'high');

        const contextSummary = `
Student Status:
- Total Tasks: ${tasks?.length || 0} (${completedTasks.length} done, ${pendingTasks.length} pending)
- High Priority Tasks: ${highPriority.length}
- Urgent/Overdue: ${urgentTasks || 0}
- Study Hours Today: ${hoursToday || 0}h
- Current Streak: ${streak || 0} days
- Upcoming Exams: ${exams || 'None'}
- Top Pending Tasks: ${pendingTasks.slice(0, 3).map(t => t.title).join(', ') || 'None'}
        `.trim();

        const systemPrompt = `You are an expert AI study coach for StudyPulse. Your goal is to provide highly personalized, data-driven advice.

STUDENT DATA:
${contextSummary}

STRICT GUIDELINES:
1. ALWAYS check the "Pending Tasks" count. If it's greater than 0, do NOT say "Congratulations on completing everything". Instead, mention that they have ${pendingTasks.length} tasks to tackle.
2. ${urgentTasks > 0 ? `URGENT: Mention the ${urgentTasks} overdue tasks immediately with a focus on catching up.` : 'Acknowledge their progress.'}
3. ${streak > 0 ? `STREAK: Celebrate their ${streak}-day streak and use it as motivation.` : 'Focus on building long-term consistency.'}
4. Provide 3 specific, ACTIONABLE study tips based on their current load (priority, subject, and time spent).
5. Address the student's question directly: "${question}"
6. Keep response under 150 words. Be encouraging but honest about their schedule.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "StudyPulse"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question || "How should I study today?" }
                ],
                temperature: 0.8,
                max_tokens: 300
            })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (data.error) throw new Error(data.error.message);

        res.json({ success: true, reply: data.choices[0].message.content });

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ success: false, reply: "AI unavailable.", error: error.message });
    }
});

module.exports = router;