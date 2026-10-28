import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Clock, Undo } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, historyIndex, undo, redo } = useProject();

  return (
    <div className="flex flex-col h-full text-xs">
      <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <span className="font-semibold text-slate-200">History Log</span>
        <span className="font-mono text-[11px] text-cyan-400">
          Step {historyIndex + 1} of {history.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {history.map((item, idx) => {
          const isCurrent = idx === historyIndex;
          const isFuture = idx > historyIndex;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (idx < historyIndex) {
                  for (let i = 0; i < historyIndex - idx; i++) undo();
                } else if (idx > historyIndex) {
                  for (let i = 0; i < idx - historyIndex; i++) redo();
                }
              }}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                isCurrent
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-medium'
                  : isFuture
                  ? 'text-slate-600 hover:text-slate-400 hover:bg-slate-900/60'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Clock className={`h-3.5 w-3.5 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.description}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
