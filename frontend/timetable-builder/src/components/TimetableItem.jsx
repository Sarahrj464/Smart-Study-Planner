import React from 'react';

export default function TimetableItem({ item }) {
  return (
    <div
      className="p-2 rounded-md text-sm mb-2 cursor-pointer"
      style={{ backgroundColor: item.color || '#60a5fa' }}
    >
      <div className="font-semibold text-white">{item.title}</div>
      <div className="text-xs text-white/90">{item.start} - {item.end}</div>
      {item.location && <div className="text-xs text-white/80">{item.location}</div>}
    </div>
  );
}