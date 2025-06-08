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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
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
    if (!message.trim() || !user) return;
  
    try {
      const chatDocRef = doc(db, "chats", user.uid);
      await setDoc(chatDocRef, {
        createdAt: serverTimestamp(),
        displayName: user.displayName || null,
        email: user.email || null,
      }, { merge: true });
  
      await addDoc(collection(chatDocRef, "messages"), {
        text: message,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });
  
      setMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-2xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <span>Chat with us</span>
            <button onClick={() => setIsOpen(false)}>✖️</button>
          </div>

          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl max-w-[75%] ${
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

          <div className="p-2 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-full px-4 py-1"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="text-blue-600 font-bold">
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}
