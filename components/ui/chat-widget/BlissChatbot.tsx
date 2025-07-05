"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
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
  AlertTriangle,
  RefreshCw,
  Send,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useUIStore } from "@/stores/uiStore";
import { useApiClient } from "@/hooks/useApiClient";

const GEMINI_API_ROUTE = "/api/chat";

type Message = {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
};

export const BlissChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [maximized, setMaximized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { setLoading, isKeyLoading, createPersistentNotification } = useUIStore();
  const loadingKey = "bliss-chatbot";
  const loading = isKeyLoading(loadingKey);

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
      get(GEMINI_API_ROUTE)
        .then((response: any) => {
          const data = response?.data;
          if (data && data.messages) {
            setMessages(
              data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
              }))
            );
          }
        })
        .catch((error: any) => {
          createPersistentNotification({
            type: 'error',
            title: 'Erreur de chargement',
            message: 'Impossible de charger l\'historique du chat',
            duration: 5000
          });
        });
    }
  }, [open]);

  // ✅ MIGRATION : Utilisation du client API
  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
    post: sendMessage,
    delete: clearChat,
    get
  } = useApiClient<any>({
    onSuccess: async () => {
      setLoading(loadingKey, false);
      await createPersistentNotification({
        type: 'info',
        title: 'Chatbot',
        message: 'Réponse du chatbot reçue'
      });
    },
    onError: (error) => {
      console.error('Erreur chat:', error);
      setLoading(loadingKey, false);
      createPersistentNotification({
        type: 'error',
        title: 'Erreur de communication',
        message: 'Impossible de communiquer avec l\'assistant'
      });
    }
  });

  // ✅ OPTIMISÉ : Envoi de message
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(loadingKey, true);

    try {
      await sendMessage(GEMINI_API_ROUTE, {
        prompt: message
      });
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  // ✅ OPTIMISÉ : Effacement du chat
  const handleClearChat = async () => {
    try {
      await clearChat(GEMINI_API_ROUTE);
      setMessages([]);
      createPersistentNotification({
        type: 'success',
        title: 'Chat effacé',
        message: 'L\'historique de conversation a été supprimé'
      });
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  const session = useSession();

  // Futuristic glassmorphism + BlissLearn blue
  return (
    <>
      {/* Bouton flottant IA */}
      {!open && (
        <button
          className="fixed bottom-18 right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-4 rounded-full shadow-2xl transition-all border-2 border-blue-300/40 backdrop-blur-xl flex items-center justify-center"
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
              className={`relative bg-gradient-to-br h-[95vh] from-gray-900/90 to-blue-900/80 shadow-2xl border-l border-blue-700/30 flex flex-col
                ${
                  isMobile || maximized
                    ? "w-full h-[95vh] rounded-2xl"
                    : "w-[400px] h-[80vh] rounded-l-2xl rounded-2xl"
                }
                animate-in fade-in slide-in-from-right-8`}
              style={{ maxWidth: isMobile || maximized ? "100vw" : 400 }}
            >
              {/* Header */}
              <div className="rounded-t-3xl flex items-center justify-between px-6 py-4 border-b border-blue-700/20 bg-gradient-to-r from-blue-800/40 to-transparent">
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
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    ))}
                  {/* Effacer l'historique */}
                  <button
                    className="p-2 rounded-full hover:bg-red-900/30 text-red-400 hover:text-white transition"
                    onClick={handleClearChat}
                    aria-label="Effacer l'historique"
                    disabled={loading || messages.length === 0}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {/* Fermer */}
                  <button
                    className="p-2 rounded-full hover:bg-blue-900/30 text-gray-300 hover:text-white transition"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
                    , note support IA vous répond !
                  </div>
                )}
                {/* Liste des messages sans ScrollArea */}
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/favicon.svg" alt="Bliss" />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-2xl p-3 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-200 rounded-bl-none"
                        } ${
                          message.error
                            ? "bg-red-500/20 border border-red-500/50"
                            : ""
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.error && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-red-300">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{error}</span>
                            <button
                              onClick={() => handleSendMessage(message.content)}
                              className="flex items-center gap-1 hover:underline"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Réessayer
                            </button>
                          </div>
                        )}
                      </div>
                      {message.role === "user" &&
                        session.data?.user?.image && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={session.data.user.image}
                              alt={session.data.user.name || "User"}
                            />
                            <AvatarFallback>
                              {session.data.user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                    </div>
                  ))}
                </div>
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 text-blue-200 rounded-2xl border border-blue-700/20 animate-pulse">
                      <Bot className="w-4 h-4 text-blue-400 animate-spin" />
                      <span>L'IA réfléchit…</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Input */}
                             <form className="relative" onSubmit={(e) => {
                 e.preventDefault();
                 handleSendMessage(input);
               }}>
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez une question à Bliss..."
                  className="rounded-none rounded-b-3xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(input);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full"
                  disabled={loading || !input.trim()}
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
