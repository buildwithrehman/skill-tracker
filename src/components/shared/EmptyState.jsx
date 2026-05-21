import React from 'react';

export function EmptyState({ title, description, icon: Icon, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
        <Icon size={40} className="text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-8">{description}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
