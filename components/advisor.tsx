"use client";
import { useState } from "react";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { Workspace, PageIntro } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/use-profile";
type Message = { role: "user" | "advisor"; text: string };
export function Advisor() {
  const { state } = useProfile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  function send(text: string) {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    const reply = /budget|cost|money|scholarship/.test(lower)
      ? "Scripted preview: begin with tuition, 12 months of living costs, one-time setup, and a contingency. The Finance screen lets you explore fictional numbers. No scholarship award or employment income is assumed."
      : /ielts|sat|improve|score/.test(lower)
        ? `Scripted preview: your saved IELTS starting point is ${state.profile.ielts.toFixed(1)}. The Improvement Lab lets you try a hypothetical score and save a preparation goal. It does not predict test results or admission.`
        : /backup|plan|route/.test(lower)
          ? "Scripted preview: a useful backup can be a lower-cost destination, more preparation time, or a later intake. In the Pathway Planner, compare a primary and backup route and test a reduced-budget scenario."
          : "Scripted preview: start with your profile, compare a few fictional programs, and identify one preparation step. This interface is a demonstration with fixed responses. It cannot assess official eligibility or provide verified consultations.";
    setMessages((m) => [
      ...m,
      { role: "user", text: text.trim().slice(0, 500) },
      { role: "advisor", text: reply },
    ]);
    setInput("");
  }
  return (
    <Workspace>
      <PageIntro
        eyebrow="A PREVIEW OF A FUTURE CONVERSATION"
        title="A little guidance. Clearly labeled."
        description="Explore the advisor interface with scripted responses. There is no AI connection or verified consultation here."
      />
      <section className="advisor-layout">
        <div className="advisor-chat">
          <div className="advisor-chat-header">
            <span className="panel-icon purple">
              <MessageCircle size={18} />
            </span>
            <div>
              <strong>Pathway Advisor</strong>
              <span>Scripted demo · No AI connected</span>
            </div>
            <span className="demo-badge">PREVIEW</span>
          </div>
          <div
            className="chat-messages"
            role="log"
            aria-label="Scripted advisor conversation"
            aria-live="polite"
          >
            <article className="message advisor-message">
              <span>ADVISOR PREVIEW</span>
              <p>
                Your next chapter can start with one good question. Try a topic
                below to explore this interface. Please use fictional
                information.
              </p>
            </article>
            {messages.map((m, i) => (
              <article
                key={i}
                className={`message ${m.role === "user" ? "user-message" : "advisor-message"}`}
              >
                <span>{m.role === "user" ? "YOU" : "SCRIPTED RESPONSE"}</span>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
          {messages.length === 0 && (
            <div className="suggested-questions">
              {[
                "How can I plan my budget?",
                "What if I improve my IELTS?",
                "Help me explore a backup route",
              ].map((q) => (
                <button key={q} onClick={() => send(q)}>
                  {q}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          )}
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor="advisor-message">
              Your demo question
            </label>
            <input
              id="advisor-message"
              placeholder="Ask a demo question…"
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              size="small"
              disabled={!input.trim()}
              aria-label="Send demo question"
            >
              <Send size={16} />
            </Button>
          </form>
          <p className="chat-disclaimer">
            Fixed demonstration responses. Messages stay in memory and disappear
            on refresh.
          </p>
        </div>
        <aside className="panel advisor-context">
          <span className="eyebrow">YOUR STARTING POINT</span>
          <h2>Context for the conversation.</h2>
          <dl>
            <div>
              <dt>Study direction</dt>
              <dd>{state.profile.field}</dd>
            </div>
            <div>
              <dt>Career curiosity</dt>
              <dd>{state.profile.career}</dd>
            </div>
            <div>
              <dt>Destinations</dt>
              <dd>{state.profile.countries.join(", ") || "Still exploring"}</dd>
            </div>
            <div>
              <dt>Preparation time</dt>
              <dd>{state.profile.months} months</dd>
            </div>
          </dl>
          <p className="muted">
            A future integration would need verified sources, transparent
            limitations, and a clear consent model.
          </p>
          <Link href="/dashboard" className="text-link">
            Back to my starting point <ArrowUpRight size={14} />
          </Link>
        </aside>
      </section>
    </Workspace>
  );
}
