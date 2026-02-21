const API_URL = "http://localhost:5003/api/v1";

export async function getStudyAdvice(context) {
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(context),
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid response from server");
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.reply || data?.error || "AI request failed");
  }

  return data.reply;
}

export async function testGemini() {
  return await getStudyAdvice({ question: "Hello! Are you working?" });
}