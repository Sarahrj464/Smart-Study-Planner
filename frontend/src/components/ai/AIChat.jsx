import React, { useState } from "react";

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi Sarah 👋 How can I help you study today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMsg = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error connecting to AI" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-2xl shadow">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl max-w-[70%] ${msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white border"
              }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-white border p-3 rounded-2xl w-fit">
            Typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2 outline-none"
          placeholder="Ask your AI study coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
