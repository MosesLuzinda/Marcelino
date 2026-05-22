"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { PortalPageShell } from "./PortalPageShell";

type Conversation = {
  id: string;
  title: string;
  messages?: { content: string; createdAt: string }[];
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { firstName: string; lastName: string };
};

export function MessagesPanel({ title, description }: { title: string; description?: string }) {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api<Conversation[]>("/messaging/conversations", { token })
      .then((r) => {
        if (!r.success) setError(r.error || "Failed to load");
        else {
          const list = (r.data as Conversation[]) || [];
          setConversations(list);
          if (list[0]) setSelectedId(list[0].id);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedId) return;
    api<Message[]>(`/messaging/conversations/${selectedId}/messages`, { token }).then((r) => {
      if (r.success) setMessages((r.data as Message[]) || []);
    });
  }, [token, selectedId]);

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <PortalPageShell title={title} description={description} loading={loading} error={error} empty={!loading && !error && conversations.length === 0}>
      <section className="grid lg:grid-cols-3 gap-4 min-h-[400px]">
        <article className="card lg:col-span-1 space-y-2">
          <h2 className="font-semibold text-sm text-slate-500 uppercase tracking-wide">Conversations</h2>
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-3 rounded-xl transition ${selectedId === c.id ? "bg-accent-teal/10 border border-accent-teal/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
            >
              <p className="font-medium text-sm">{c.title}</p>
              {c.messages?.[0] && <p className="text-xs text-slate-500 truncate mt-1">{c.messages[0].content}</p>}
            </button>
          ))}
        </article>
        <article className="card lg:col-span-2 flex flex-col">
          <h2 className="font-semibold mb-4">{selected?.title || "Select a conversation"}</h2>
          <section className="flex-1 space-y-3 overflow-y-auto max-h-[360px]">
            {messages.map((m) => (
              <section key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs font-medium text-accent-teal mb-1">{m.sender.firstName} {m.sender.lastName}</p>
                <p className="text-sm">{m.content}</p>
              </section>
            ))}
          </section>
        </article>
      </section>
    </PortalPageShell>
  );
}
