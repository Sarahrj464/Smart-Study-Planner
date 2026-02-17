// frontend/src/components/ai/FloatingCoach.jsx
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import StudyCoach from './StudyCoach';

export default function FloatingCoach() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ⭐ FLOATING BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50"
          title="AI Study Coach"
        >
          <MessageCircle size={28} />

          {/* Pulse animation */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* ⭐ CHAT PANEL */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-150 z-50 animate-scaleIn">
          <div className="relative h-full shadow-2xl rounded-3xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10 shadow-lg transition-colors"
            >
              <X size={16} />
            </button>

            {/* Study Coach Component */}
            <StudyCoach />
          </div>
        </div>
      )}
    </>
  );
}