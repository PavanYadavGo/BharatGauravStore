'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: input });
      const botMessage = { sender: 'bot' as const, text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'bot' as const, text: 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Circular Chat Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Toggle Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-20 right-5 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col max-h-[80vh] z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl animate-pulse">
                    Typing...
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Field */}
            <div className="flex items-center gap-2 border-t px-3 py-2 bg-white dark:bg-gray-900">
              <input
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <Button className="px-4 py-2 text-sm" onClick={sendMessage} disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Send'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
