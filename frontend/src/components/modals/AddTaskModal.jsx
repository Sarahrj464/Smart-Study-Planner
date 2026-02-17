// import React from 'react';
// import { X } from 'lucide-react';
// import TaskForm from '../forms/TaskForm';

// export default function AddTaskModal({ isOpen, onClose }) {
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-black text-slate-800 dark:text-white">
//             Add New
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
//           >
//             <X size={24} className="text-slate-500" />
//           </button>
//         </div>

//         {/* Task Form */}
//         <TaskForm onClose={onClose} />
//       </div>
//     </div>
//   );
// }

// frontend/src/components/modals/AddTaskModal.jsx
import React from "react";
import { X } from "lucide-react";
import TaskForm from "../forms/TaskForm";

export default function AddTaskModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <TaskForm onClose={onClose} />
      </div>
    </div>
  );
}
