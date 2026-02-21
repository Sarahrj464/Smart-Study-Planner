const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const testAI = async () => {
    console.log("--- AI DIAGNOSTIC START ---");
    console.log("API Key present:", !!process.env.OPENROUTER_API_KEY);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Say hello!" }
                ]
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Raw Response:", text);

        try {
            const data = JSON.parse(text);
            console.log("Parsed JSON:", JSON.stringify(data, null, 2));
            if (data.choices) {
                console.log("✅ SUCCESS: AI replied!");
            } else {
                console.log("❌ FAIL: No choices in response");
            }
        } catch (e) {
            console.error("❌ FAIL: Response is not valid JSON");
        }
    } catch (err) {
        console.error("🔥 CRITICAL: Fetch failed!", err);
    }
};

testAI();
