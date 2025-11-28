import React, { useState } from 'react';
import { Trello } from 'lucide-react';

const TaskCommandCenterWidget = ({ onLaunchBoard }) => {
  // --- THEME CONSTANTS ---
  const colors = { 
    gold: '#e1b542', 
    bronze: '#78643e',
    slateBlue: '#404e6d',
    darkBase: '#2b3446'
  };
  const goldAccent = { color: colors.gold, textShadow: `0 0 8px ${colors.gold}80` };

  // --- STATE ---
  // FIX: Ensure 'useState' is capitalized correctly
  const [newKanbanInput, setNewKanbanInput] = useState('');
  const [newKanbanTag, setNewKanbanTag] = useState('Code');
  
  // Mock Data
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: 'Design Vault Logo', status: 'done', tag: 'Design' },
    { id: 2, title: 'Code Drag & Drop Logic', status: 'in-progress', tag: 'Code' },
    { id: 3, title: 'Record Devlog #1', status: 'todo', tag: 'Content' },
    { id: 4, title: 'Setup Dream Gang Bot', status: 'todo', tag: 'Code' },
  ]);

  // --- HANDLERS ---
  const addKanbanTask = (title, tag = 'Code') => { 
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title,
      status: 'todo',
      tag: tag
    };
    setKanbanTasks([...kanbanTasks, newTask]);
    setNewKanbanInput('');
  };

  const handleQuickFireTask = () => {
    if (!newKanbanInput.trim()) return;
    addKanbanTask(newKanbanInput, newKanbanTag);
  };

  // Helper for status counts
  const getCount = (status) => kanbanTasks.filter(t => t.status === status).length;

  return (
    <div 
      className="h-full w-full flex flex-col justify-between group p-6 rounded-lg border shadow-lg hover:border-white/30 transition-all" 
      style={{ 
        background: `linear-gradient(180deg, ${colors.slateBlue} 0%, ${colors.darkBase} 100%)`, 
        borderColor: colors.bronze,
        boxShadow: `inset 0 0 15px rgba(0,0,0,0.5)`
      }}
    >
      <div>
        <h3 className="flex items-center gap-3 font-extrabold mb-4 text-lg" style={goldAccent}>
          <Trello size={20} /> TASK COMMAND CENTER
        </h3>
        
        {/* Quick Fire Task Input */}
        <div className="pt-3 border-t border-white/10 mb-4">
          <input 
            type="text" 
            value={newKanbanInput} 
            onChange={(e) => setNewKanbanInput(e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { e.preventDefault(); handleQuickFireTask(); } 
            }} 
            placeholder="Quick task... (Enter to add to To Do)" 
            className="w-full bg-black/40 text-white text-sm p-2 rounded border border-white/10 focus:outline-none font-mono"
          />
          <div className="flex justify-between items-center mt-2">
            <select 
              value={newKanbanTag} 
              onChange={(e) => setNewKanbanTag(e.target.value)} 
              className="bg-black/40 text-white text-xs p-1 rounded border border-white/10 focus:outline-none"
            >
              <option value="Code">Code</option>
              <option value="Content">Content</option>
              <option value="Design">Design</option>
              <option value="Biz">Biz</option>
            </select>
            <div className="text-[10px] font-mono text-white/50">TAG: {newKanbanTag}</div>
          </div>
        </div>

        {/* Status Snapshot */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono text-white/70">
           <div className="bg-black/30 p-2 rounded border border-white/5">
             <div className="font-bold text-white mb-1">{getCount('todo')}</div>
             TO DO
           </div>
           <div className="bg-black/30 p-2 rounded border border-white/5">
             <div className="font-bold text-yellow-400 mb-1">{getCount('in-progress')}</div>
             DOING
           </div>
           <div className="bg-black/30 p-2 rounded border border-white/5">
             <div className="font-bold text-green-400 mb-1">{getCount('done')}</div>
             DONE
           </div>
        </div>
      </div>
      
      <button 
        onClick={onLaunchBoard} 
        className="mt-6 w-full py-3 rounded-md bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors font-bold tracking-wider text-xs"
      >
        LAUNCH BOARD
      </button>
    </div>
  );
};

export default TaskCommandCenterWidget;