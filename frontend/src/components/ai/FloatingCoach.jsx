// frontend/src/components/ai/FloatingCoach.jsx
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyCoach from './StudyCoach';

export default function FloatingCoach() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ⭐ FLOATING BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl z-50 flex items-center justify-center border-4 border-white dark:border-slate-900"
            title="AI Study Coach"
          >
            <MessageCircle size={28} />
            {/* Pulse animation */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ⭐ CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[600px] h-[800px] max-h-[90vh] z-50"
          >
            <div className="relative h-full shadow-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Close Button - Placed inside for better visibility at 100% viewport */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-100/80 hover:bg-red-500 hover:text-white backdrop-blur-md text-slate-500 rounded-full flex items-center justify-center z-50 transition-all duration-300 shadow-sm"
              >
                <X size={18} />
              </button>

              {/* Study Coach Component */}
              <StudyCoach />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
