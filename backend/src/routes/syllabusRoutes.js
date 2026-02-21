const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDF allowed!'), false);
    }
});

router.post('/upload', protect, upload.single('syllabus'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

        console.log(`📄 PDF: ${req.file.originalname}`);

        const fileName = req.file.originalname.replace('.pdf', '').replace(/_/g, ' ');
        const text = `Subject: ${fileName}. Create a comprehensive study plan.`;

        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
                    { role: "system", content: `Create a study plan. Return ONLY this JSON format:
{"subjects":["Subject"],"totalTopics":12,"estimatedWeeks":6,"studyPlan":[{"week":1,"topics":["Topic 1","Topic 2"],"dailyHours":2,"priority":"High"}],"importantDates":["Midterm: Week 3"],"tips":["Tip 1","Tip 2","Tip 3"],"summary":"Course summary here"}` },
                    { role: "user", content: text }
                ],
                temperature: 0.4,
                max_tokens: 1000
            })
        });

        const aiData = await aiResponse.json();
        if (aiData.error) throw new Error(aiData.error.message);

        let studyPlan;
        try {
            const raw = aiData.choices[0].message.content.replace(/```json|```/g, '').trim();
            studyPlan = JSON.parse(raw);
        } catch (e) {
            studyPlan = {
                summary: `Study plan for ${fileName}`,
                subjects: [fileName],
                totalTopics: 12,
                estimatedWeeks: 6,
                studyPlan: [
                    { week: 1, topics: ['Introduction', 'Core Concepts'], dailyHours: 2, priority: 'High' },
                    { week: 2, topics: ['Fundamentals', 'Basics'], dailyHours: 2, priority: 'High' },
                    { week: 3, topics: ['Intermediate Topics'], dailyHours: 3, priority: 'High' },
                    { week: 4, topics: ['Advanced Concepts'], dailyHours: 3, priority: 'Medium' },
                    { week: 5, topics: ['Review & Practice'], dailyHours: 2, priority: 'Medium' },
                    { week: 6, topics: ['Final Revision'], dailyHours: 4, priority: 'High' }
                ],
                importantDates: ['Midterm: Week 3', 'Final: Week 6'],
                tips: ['Study 2 hours daily', 'Take breaks every hour', 'Review notes daily']
            };
        }

        console.log('✅ Study plan generated!');
        res.json({ success: true, fileName: req.file.originalname, studyPlan });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;