const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const {
            question,
            customSystemPrompt,
            tasks,
            exams,
            hoursToday,
            streak,
            urgentTasks,
            pendingCount
        } = req.body;

        const pendingTasks = tasks?.filter(t => !t.completed) || [];
        const highPriority = pendingTasks.filter(t =>
            t.priority === 'High' || t.priority === 'high'
        );

        const defaultSystemPrompt = `You are an encouraging AI study coach for StudyPulse.

Student Status:
- Total Tasks: ${tasks?.length || 0}
- Pending: ${pendingCount || pendingTasks.length}
- High Priority: ${highPriority.length}
- Urgent/Overdue: ${urgentTasks || 0}
- Study Hours Today: ${hoursToday || 0}h
- Streak: ${streak || 0} days
- Upcoming Exams: ${exams || 'None'}
- Top Pending: ${pendingTasks.slice(0, 3).map(t => t.title).join(', ') || 'None'}

Based on this real data:
1. ${(urgentTasks || 0) > 0 ? `⚠️ Address ${urgentTasks} overdue/urgent tasks first` : 'Acknowledge their progress'}
2. Give 3 specific actionable tips based on their actual tasks
3. End with one short motivational line

Keep response under 150 words. Be personalized and encouraging.`;

        // ✅ If customSystemPrompt provided use it, else use default
        const finalSystemPrompt = customSystemPrompt || defaultSystemPrompt;

        console.log('🤖 Using prompt type:', customSystemPrompt ? 'CUSTOM (task creation)' : 'DEFAULT (chat)');

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
                    { role: "system", content: finalSystemPrompt },
                    { role: "user", content: question || "How should I study today?" }
                ],
                temperature: customSystemPrompt ? 0.1 : 0.8,
                max_tokens: customSystemPrompt ? 1000 : 300
            })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (data.error) throw new Error(data.error.message);

        const reply = data.choices[0].message.content;
        console.log('🤖 AI reply preview:', reply.slice(0, 100));

        res.json({ success: true, reply });

    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({
            success: false,
            reply: "AI unavailable. Please try again.",
            error: error.message
        });
    }
});

module.exports = router;