"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !user) return;

    try {
      const chatDocRef = doc(db, "chats", user.uid);

      await setDoc(
        chatDocRef,
        {
          createdAt: serverTimestamp(),
          displayName: user.displayName || null,
          email: user.email || null,
        },
        { merge: true }
      );

      await addDoc(collection(chatDocRef, "messages"), {
        text: trimmed,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Fix: scroll after rendering
    }
  }, [messages]);

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-box"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white shadow-xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <span className="font-semibold">Chat with us</span>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-red-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-3 py-2 rounded-xl text-sm max-w-[75%] whitespace-pre-wrap break-words ${
                    msg.senderId === user.uid
                      ? "bg-blue-100 self-end ml-auto"
                      : "bg-gray-200 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 border-t flex gap-2 items-center">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-full px-4 py-1"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="text-blue-600 font-bold hover:underline"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button (always visible) */}
      {!isOpen && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
