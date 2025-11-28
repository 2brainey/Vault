import React, { useState } from 'react';
import { LayoutDashboard, Plus, MoreHorizontal } from 'lucide-react';

const TaskCommandCenterWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Refactor Vitals UI', status: 'todo', tag: 'Code' },
    { id: 2, title: 'Design Brain Asset', status: 'in-progress', tag: 'Art' },
    { id: 3, title: 'Fix Resize Bug', status: 'done', tag: 'Bug' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
      if(!newTask.trim()) return;
      setTasks([...tasks, { id: Date.now(), title: newTask, status: 'todo', tag: 'Gen' }]);
      setNewTask('');
  };

  const moveTask = (id, newStatus) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const renderColumn = (status, label, color) => (
      <div className="flex-1 flex flex-col bg-black/20 rounded-lg border border-slate-700/50 overflow-hidden h-full">
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${color} bg-black/30 flex justify-between`}>
              {label} <span>{tasks.filter(t => t.status === status).length}</span>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
              {tasks.filter(t => t.status === status).map(t => (
                  <div key={t.id} className="bg-[#2a2a2a] p-2 rounded border border-slate-700 hover:border-slate-500 group relative">
                      <div className="text-xs text-white font-medium mb-1">{t.title}</div>
                      <div className="flex justify-between items-center">
                          <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{t.tag}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {status !== 'todo' && <button onClick={() => moveTask(t.id, status === 'done' ? 'in-progress' : 'todo')} className="w-4 h-4 rounded bg-slate-700 hover:bg-slate-600 text-[8px] flex items-center justify-center text-white">{'<'}</button>}
                              {status !== 'done' && <button onClick={() => moveTask(t.id, status === 'todo' ? 'in-progress' : 'done')} className="w-4 h-4 rounded bg-slate-700 hover:bg-slate-600 text-[8px] flex items-center justify-center text-white">{'>'}</button>}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="h-full w-full flex flex-col p-4 bg-[#1e1e1e] border border-[#404e6d] rounded-xl shadow-lg relative">
      <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><LayoutDashboard size={18} className="text-amber-500"/> COMMAND CENTER</h3>
          <div className="flex gap-2">
              <input 
                  value={newTask} onChange={(e) => setNewTask(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="New Task..." 
                  className="bg-black/40 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 w-40"
              />
              <button onClick={addTask} className="p-1 bg-amber-600 hover:bg-amber-500 rounded text-white"><Plus size={14}/></button>
          </div>
      </div>
      <div className="flex-1 flex gap-3 overflow-hidden min-h-[200px]">
          {renderColumn('todo', 'To Do', 'text-slate-400')}
          {renderColumn('in-progress', 'Active', 'text-blue-400')}
          {renderColumn('done', 'Done', 'text-emerald-400')}
      </div>
    </div>
  );
};

export default TaskCommandCenterWidget;