'use client';

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaCommentDots, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="min-h-screen px-6 py-20 bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.h1>

      <motion.p
  className="text-lg text-center text-gray-700 dark:text-gray-300 mb-10"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  We&apos;d love to hear from you!
</motion.p>

      {/* Success Message */}
      {sent && (
        <motion.div
          className="mb-6 text-center text-green-600 dark:text-green-400 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Message sent successfully!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl rounded-2xl hover:shadow-blue-200 dark:hover:shadow-blue-800 transition duration-300 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700 dark:text-blue-400">Contact Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={sendEmail} className="space-y-5">
                {/* Name */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <FaUser /> Your Name
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <FaEnvelope /> Your Email
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Address */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <FaMapMarkerAlt /> Address
                  </label>
                  <Textarea
                    name="user_address"
                    placeholder="Address"
                    required
                    className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl"
                  />
                </div>

                {/* Message */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <FaCommentDots /> Message
                  </label>
                  <Textarea
                    name="message"
                    rows={4}
                    placeholder="Message"
                    required
                    className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-xl shadow-lg transition"
                >
                  Send Message
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Google Map and Info */}
        <motion.div
          className="flex flex-col justify-center items-center gap-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <iframe
              title="Bharat Gaurav Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.6673139859195!2d72.85392301490467!3d19.12226385561738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7a8cf1efbc7%3A0x3b040eeb6b8a7cb0!2sBharat%20Gaurav%20Store!5e0!3m2!1sen!2sin!4v1685210705693!5m2!1sen!2sin"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-full"
            ></iframe>
          </div>

          <div className="text-left text-gray-800 dark:text-gray-200 space-y-2 w-full px-2">
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> Mumbai, Maharashtra, India</p>
            <p className="flex items-center gap-2"><FaPhoneAlt /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><FaEnvelope /> support@bharatgauravstore.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
