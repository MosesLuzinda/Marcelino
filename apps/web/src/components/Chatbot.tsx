"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { api } from "@/lib/api";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I'm the Marcelino Academy assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await api<{ response: string }>("/ai/chat", { method: "POST", body: JSON.stringify({ message: userMsg }) });
      setMessages((m) => [...m, { role: "bot", text: res.data?.response || "I'm sorry, I couldn't process that." }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again or contact info@marcelino.edu" }]);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent-teal text-white shadow-2xl hover:scale-110 transition"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <section className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl glass shadow-2xl flex flex-col overflow-hidden">
          <header className="bg-gradient-to-r from-brand-600 to-accent-teal p-4 text-white">
            <h3 className="font-semibold">Marcelino Assistant</h3>
            <p className="text-sm opacity-90">Ask about admissions, fees & more</p>
          </header>
          <section className="flex-1 h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <p key={i} className={`text-sm p-3 rounded-xl max-w-[85%] ${m.role === "user" ? "ml-auto bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                {m.text}
              </p>
            ))}
            {loading && <p className="text-sm text-slate-500 animate-pulse">Thinking...</p>}
          </section>
          <footer className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button onClick={send} disabled={loading} className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
              <Send className="h-5 w-5" />
            </button>
          </footer>
        </section>
      )}
    </>
  );
}
