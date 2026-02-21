const API_URL = "/api/v1";

/**
 * Get study advice from the AI Study Coach via backend proxy
 * @param {Object} context - User context (question, tasks, etc.)
 */
export async function getStudyAdvice(context) {
  try {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(context),
    });

    const data = await response.json();

    // ✅ safer handling
    if (!response.ok) {
      throw new Error(data?.reply || data?.message || "Failed to get AI advice");
    }

    // ✅ support multiple backend formats
    return data.reply || data.message || "AI did not return a response.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return `❌ Error: ${error.message}`;
  }
}


/**
 * Test the AI connection
 */
export async function testGemini() {
  try {
    console.log("Testing AI Connection...");
    const result = await getStudyAdvice({ question: "Hello! Are you working?" });
    console.log("AI Response:", result);
    return result;
  } catch (error) {
    console.error("AI Test Failed:", error);
    throw error;
  }
}
