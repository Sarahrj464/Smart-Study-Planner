// aiService.js

class AiService {
    constructor(model) {
        // Proper error handling for model initialization
        if (!model || typeof model !== 'string') {
            throw new Error('Invalid model provided.');
        }
        this.model = model;
    }

    initialize() {
        try {
            // Initialization logic here
            this.model = this.model.replace('gemini-pro', 'gemini-1.5-flash');
            console.log(`Model initialized: ${this.model}`);
        } catch (error) {
            console.error('Error during model initialization:', error);
        }
    }
}

module.exports = AiService;