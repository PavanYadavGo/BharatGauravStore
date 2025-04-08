'use client';

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaCommentDots } from 'react-icons/fa';

export default function ContactPage() {
  const form = useRef();
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_bx2vq9a',
        'template_m23a9ir',
        form.current,
        '308mF4O8LyGF7euS6'
      )
      .then(() => {
        setSent(true);
        form.current.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('Something went wrong!');
      });
  };

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50 dark:bg-gray-900 text-center transition-colors duration-300">
      <motion.h1 
        className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-700 dark:text-gray-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Have questions or feedback? We'd love to hear from you!
      </motion.p>

      {sent && (
        <motion.div 
          className="mb-6 text-green-600 dark:text-green-400 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Message sent successfully!
        </motion.div>
      )}

      <motion.form
        ref={form}
        onSubmit={sendEmail}
        className="max-w-xl mx-auto space-y-4 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <label className="block">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <FaUser /> Your Name
          </span>
          <input
            type="text"
            name="user_name"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg"
          />
        </label>

        <label className="block">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <FaEnvelope /> Your Email
          </span>
          <input
            type="email"
            name="user_email"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg"
          />
        </label>

        <label className="block">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <FaCommentDots /> Message
          </span>
          <textarea
            name="message"
            rows="5"
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg"
          ></textarea>
        </label>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
        >
          Send Message
        </button>
      </motion.form>
    </div>
  );
}
