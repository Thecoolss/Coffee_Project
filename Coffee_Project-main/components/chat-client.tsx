"use client";

import { ChatMessage, Coffee } from "@/types";
import { useEffect, useRef, useState } from "react";
import { getClientAiMode } from "./mode-toggle";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { TalkingBean } from "./talking-bean";
import { AnimatePresence, motion } from "motion/react";
import { beanThemeForCoffee } from "@/lib/bean-theme";

type Props = {
  coffee: Coffee;
};

const starterQuestions = [
  "What do you pair with?",
  "When are you best to drink?",
  "Why do you taste this way?"
];

export function ChatClient({ coffee }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hey, I'm ${coffee.name}. Ask me anything about my vibe, flavor, or origin story.`
    }
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const theme = beanThemeForCoffee(coffee);
  const lastSpokenIndex = useRef(-1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];
    if (!last || last.role !== "assistant" || lastIndex === lastSpokenIndex.current) return;
    lastSpokenIndex.current = lastIndex;
    const words = last.content.split(/\s+/).filter(Boolean).length;
    const duration = Math.min(5000, Math.max(1400, words * 140));
    setSpeaking(true);
    const timer = setTimeout(() => setSpeaking(false), duration);
    return () => clearTimeout(timer);
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    const mode = getClientAiMode();
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coffeeId: coffee.id, messages: nextMessages, mode })
      });
      const data = (await response.json()) as { response: string };
      setMessages([...nextMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("[Chat] request failed", error);
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "I lost connection for a moment. Ask me again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const beanMood = loading ? "thinking" : "happy";
  const isTalking = loading || speaking;
  const isIntro = messages.length <= 1 && !loading && !speaking;

  return (
    <section className="flex min-h-[calc(100svh-7rem)] flex-col gap-3 pt-4 md:min-h-[calc(840px-7rem)]">
      <div className="flex items-center gap-3">
        <Link
          href={`/coffee/${coffee.id}`}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white/70"
        >
          <ArrowLeft size={16} className="text-mocha-700" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-mocha-900">{coffee.name}</p>
          <p className="truncate text-[11px] text-mocha-500">
            {coffee.originCountry} · {coffee.roastLevel} roast
          </p>
        </div>
      </div>

      {/* Talking Bean character */}
      <motion.div
        layout
        className="flex flex-col items-center"
        transition={{ type: "spring", stiffness: 210, damping: 22 }}
      >
        <motion.div
          animate={{ height: isIntro ? 220 : 140 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative flex items-end justify-center"
          style={{ height: isIntro ? 220 : 140 }}
        >
          <TalkingBean
            talking={isTalking}
            mood={beanMood}
            size={isIntro ? 200 : 130}
            theme={theme}
          />
        </motion.div>
        {isIntro ? (
          <p className="mt-1 text-center text-xs text-mocha-500">
            {coffee.stampIcon} {coffee.name} is listening
          </p>
        ) : null}
      </motion.div>

      {/* Chat messages */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              {msg.role === "assistant" ? (
                <div className="flex max-w-[82%] items-end gap-2">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[rgba(232,199,125,0.4)] text-sm">
                    {coffee.stampIcon}
                  </span>
                  <p className="bubble-in px-3 py-2 text-sm text-mocha-900">{msg.content}</p>
                </div>
              ) : (
                <p className="bubble-out max-w-[82%] px-3 py-2 text-sm">{msg.content}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(232,199,125,0.4)] text-sm">
              {coffee.stampIcon}
            </span>
            <div className="bubble-in flex items-center gap-1 px-3 py-3">
              <Dot />
              <Dot delay={120} />
              <Dot delay={240} />
            </div>
          </motion.div>
        ) : null}
        <div ref={endRef} />
      </div>

      {isIntro ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {starterQuestions.map((q) => (
            <button key={q} onClick={() => sendMessage(q)} className="chip shrink-0">
              {q}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(draft);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="input"
          placeholder="Ask your coffee…"
        />
        <button
          type="submit"
          disabled={loading || !draft.trim()}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-to-b from-mocha-600 to-mocha-700 text-cream-50 shadow-[0_10px_22px_-10px_rgba(77,38,21,0.6)] disabled:opacity-50"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-mocha-700/60"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
