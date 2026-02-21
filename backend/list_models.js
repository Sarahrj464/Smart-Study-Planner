const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const listModels = async () => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();
        const freeModels = data.data
            .filter(m => m.id.includes(':free'))
            .map(m => m.id);

        console.log("Free Models Found:", JSON.stringify(freeModels, null, 2));
    } catch (err) {
        console.error("Failed to list models:", err);
    }
};

listModels();
