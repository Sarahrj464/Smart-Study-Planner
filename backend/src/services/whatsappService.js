const axios = require('axios');

const idInstance = process.env.GREEN_API_INSTANCE_ID;
const apiToken = process.env.GREEN_API_TOKEN;
const apiUrl = process.env.GREEN_API_URL; // e.g. https://7103.api.greenapi.com

const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        // Format: 923XXXXXXXXX@c.us (remove all non-digits)
        let formatted = phoneNumber.toString().replace(/\D/g, '');

        // Handle Pakistan numbers specifically
        if (formatted.startsWith('0092')) {
            formatted = formatted.slice(2);
        } else if (formatted.startsWith('0')) {
            formatted = '92' + formatted.slice(1);
        } else if (!formatted.startsWith('92') && formatted.length === 10) {
            // If it's 3XXXXXXXXX (10 digits), add 92
            formatted = '92' + formatted;
        }

        const chatId = `${formatted}@c.us`;

        const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiToken}`;

        const response = await axios.post(url, {
            chatId,
            message
        });

        console.log(`✅ WhatsApp sent to ${chatId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ WhatsApp send error:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMessage };