// frontend/src/components/ai/StudyCoach.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { getStudyAdvice } from "../../services/aiService";
import { selectAllTasks } from "../../redux/slices/taskSlice";

export default function StudyCoach() {
  const tasks = useSelector(selectAllTasks);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Study Coach. Ask me anything about studying, exam prep, or time management!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Prepare context from user's tasks
      const upcomingTasks = tasks.filter(
        (t) => !t.completed && new Date(t.dueDate) > new Date(),
      );
      const completedToday = tasks.filter((t) => {
        const today = new Date().toDateString();
        return (
          t.completedAt && new Date(t.completedAt).toDateString() === today
        );
      });

      const context = {
        question: userMessage,
        tasks: upcomingTasks.slice(0, 5).map((t) => ({
          title: t.title,
          subject: t.subject,
          dueDate: t.dueDate,
          priority: t.priority,
        })),
        exams: upcomingTasks
          .filter((t) => t.type === "exam")
          .map((t) => t.title)
          .join(", "),
        hoursToday:
          completedToday.reduce((sum, t) => sum + (t.actualMinutes || 0), 0) /
          60,
        weakSubjects: [],
      };

      // Get AI response
      const advice = await getStudyAdvice(context);

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: advice }]);
    } catch (error) {
      console.error("AI Error:", error);
      const isKeyError = error.message?.includes("API key") || error.message?.includes("403");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isKeyError
            ? "❌ Invalid API key. Please check your .env file and restart the server."
            : "❌ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How should I prepare for my upcoming exam?",
    "I'm feeling overwhelmed, help me prioritize",
    "What's the best time to study?",
    "Give me motivation to start studying",
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            AI Study Coach
          </h2>
          <p className="text-sm text-slate-500">
            Your personal study assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                <User
                  size={16}
                  className="text-slate-600 dark:text-slate-300"
                />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs font-bold uppercase text-slate-500 mb-2">
            Quick Questions:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-left text-sm p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl px-5 py-3 text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
