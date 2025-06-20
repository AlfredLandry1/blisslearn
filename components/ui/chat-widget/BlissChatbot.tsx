import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  X,
  Loader2,
  Bot,
  User,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GEMINI_API_ROUTE = "/api/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const BlissChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Charger l'historique au montage
  useEffect(() => {
    if (open) {
      fetch(GEMINI_API_ROUTE)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages(
              data.messages.map((m: any) => ({
                role: m.role,
                content: m.content,
              }))
            );
          }
        });
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(GEMINI_API_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (res.ok && data.output) {
        setMessages((msgs) => [
          ...msgs,
          { role: "assistant", content: data.output },
        ]);
      } else {
        setError(data.error || "Erreur inconnue du serveur Gemini");
        setMessages((msgs) => [
          ...msgs,
          {
            role: "assistant",
            content: data.error || "(Aucune réponse de l'IA)",
          },
        ]);
      }
    } catch (e) {
      setError("Erreur lors de la communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_ROUTE, { method: "DELETE" });
      if (res.ok) setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Futuristic glassmorphism + BlissLearn blue
  return (
    <>
      {/* Bouton flottant IA */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-blue-300/40 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le chat IA"
        >
          <Sparkles className="w-7 h-7 animate-pulse" />
        </button>
      )}
      {/* Sidebar Chatbot */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={`fixed inset-0 z-50 flex ${
              isMobile ? "items-end" : "items-center justify-end"
            }`}
            style={{ pointerEvents: "auto" }}
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              key={maximized ? "maximized" : "normal"}
              initial={{
                x: 80,
                opacity: 0,
                scale: 0.98,
                borderRadius: 32,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
                borderRadius: 24,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
              exit={{
                x: 80,
                opacity: 0,
                scale: 0.98,
                borderRadius: 32,
                transition: { duration: 0.18 },
              }}
              className={`relative bg-gradient-to-br from-gray-900/90 to-blue-900/80 shadow-2xl border-l border-blue-700/30 flex flex-col
                ${
                  isMobile || maximized
                    ? "w-full h-[95vh] rounded-2xl"
                    : "w-[400px] h-[80vh] rounded-l-2xl rounded-2xl"
                }
                animate-in fade-in slide-in-from-right-8`}
              style={{ maxWidth: isMobile || maximized ? "100vw" : 400 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-blue-700/20 bg-gradient-to-r from-blue-800/40 to-transparent">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                  <span className="font-bold text-lg text-white tracking-wide">
                    BlissLearn IA
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Maximize/Minimize bouton (desktop uniquement) */}
                  {!isMobile &&
                    (maximized ? (
                      <button
                        className="p-2 rounded-full hover:bg-blue-900/30 text-gray-300 hover:text-white transition"
                        onClick={() => setMaximized(false)}
                        aria-label="Réduire le chat"
                      >
                        <Minimize2 className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        className="p-2 rounded-full hover:bg-blue-900/30 text-gray-300 hover:text-white transition"
                        onClick={() => setMaximized(true)}
                        aria-label="Agrandir le chat"
                      >
                        <Maximize2 className="w-6 h-6" />
                      </button>
                    ))}
                  {/* Effacer l'historique */}
                  <button
                    className="p-2 rounded-full hover:bg-red-900/30 text-red-400 hover:text-white transition"
                    onClick={() => setShowConfirm(true)}
                    aria-label="Effacer l'historique"
                    disabled={loading || messages.length === 0}
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                  {/* Fermer */}
                  <button
                    className="p-2 rounded-full hover:bg-blue-900/30 text-gray-300 hover:text-white transition"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le chat"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {/* Confirmation suppression */}
              {showConfirm && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                  <div className="bg-gray-900 border border-blue-700/30 rounded-xl p-6 flex flex-col items-center gap-4 shadow-2xl">
                    <div className="text-white text-lg font-semibold mb-2">
                      Effacer l'historique ?
                    </div>
                    <div className="text-gray-300 mb-4 text-center">
                      Cette action est irréversible.
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="destructive"
                        onClick={handleClearHistory}
                        disabled={loading}
                      >
                        Oui, effacer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirm(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar"
                style={{ scrollBehavior: "smooth" }}
              >
                {messages.length === 0 && !loading && (
                  <div className="text-center text-gray-400 text-base mt-10">
                    Posez-moi n'importe quelle question sur{" "}
                    <span className="text-blue-400 font-semibold">
                      BlissLearn
                    </span>
                    , l'IA vous répond !
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md text-sm whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-800/80 text-blue-200 border border-blue-700/20 rounded-bl-md"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 opacity-70" />
                        ) : (
                          <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
                        )}
                        {msg.content}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 text-blue-200 rounded-2xl border border-blue-700/20 animate-pulse">
                      <Bot className="w-4 h-4 text-blue-400 animate-spin" />
                      <span>L'IA réfléchit…</span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-400 text-center text-sm mt-2">
                    {error}
                  </div>
                )}
              </div>
              {/* Input */}
              <form
                className="flex items-center gap-2 px-4 py-4 border-t border-blue-700/20 bg-gradient-to-r from-blue-900/30 to-transparent"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  className="flex-1 bg-gray-900/60 border border-blue-700/30 rounded-full px-4 py-2 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre question…"
                  disabled={loading}
                  autoFocus={open && !isMobile}
                  maxLength={500}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg"
                  disabled={loading || !input.trim()}
                  aria-label="Envoyer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
