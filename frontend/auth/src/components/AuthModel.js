import React from 'react';

export default function AuthModal({ visible, onClose, title, children }) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="button secondary" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}