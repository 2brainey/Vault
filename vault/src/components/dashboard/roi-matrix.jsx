import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trash2, X, AlertCircle, Check, Move, Save, Upload, Download, 
  RotateCcw, Filter, PieChart, BarChart3, Tag, Grip, Info 
} from 'lucide-react';

const ROIMatrix = () => {
  // --- State Management ---
  // Core Data
  const [initiatives, setInitiatives] = useState([]);
  const [history, setHistory] = useState([]); // For Undo functionality
  
  // UI State
  const [draggedId, setDraggedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showStats, setShowStats] = useState(true);
  
  // Forms & Filters
  const [addForm, setAddForm] = useState({ name: '', impact: 50, effort: 50, tags: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'roi', direction: 'desc' });
  
  // Refs
  const fileInputRef = useRef(null);

  // --- Constants & Utils ---
  const QUADRANTS = {
    1: { title: "Quick Wins", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "High Impact, Low Effort. Do these first." },
    2: { title: "Major Projects", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", desc: "High Impact, High Effort. Plan carefully." },
    3: { title: "Fill-ins", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Low Impact, Low Effort. Do when idle." },
    4: { title: "Thankless Tasks", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", desc: "Low Impact, High Effort. Avoid or delegate." }
  };

  const getQuadrant = (impact, effort) => {
    if (impact >= 50 && effort <= 50) return 1; 
    if (impact >= 50 && effort > 50) return 2;  
    if (impact < 50 && effort <= 50) return 3; 
    if (impact < 50 && effort > 50) return 4;  
    return 3;
  };

  const getRoi = (impact, effort) => (impact / Math.max(effort, 1)).toFixed(2);

  const parseTags = (tagString) => 
    tagString ? tagString.split(',').map(t => t.trim()).filter(Boolean) : [];

  // --- History Management (Undo) ---
  const pushHistory = (newState) => {
    setHistory(prev => [...prev.slice(-19), JSON.stringify(initiatives)]); // Keep last 20 states
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = JSON.parse(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
    setInitiatives(previousState);
  };

  // --- Data Persistence & Init ---
  useEffect(() => {
    const storedState = localStorage.getItem('roiMatrixState_v2');
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState);
        setInitiatives(parsed.initiatives || []);
      } catch (e) { console.error("Failed to parse state", e); }
    } else {
      setInitiatives([
        { id: 1, name: "Optimize Database Queries", impact: 85, effort: 30, tags: ['Backend', 'Performance'] },
        { id: 2, name: "Refactor Legacy Auth", impact: 60, effort: 80, tags: ['Security', 'Tech Debt'] },
        { id: 3, name: "Update Footer Links", impact: 20, effort: 10, tags: ['UI'] },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('roiMatrixState_v2', JSON.stringify({ initiatives }));
  }, [initiatives]);

  // --- Core Handlers ---
  const handleAddSubmit = (e) => {
    e.preventDefault();
    pushHistory();
    const newInitiative = {
      id: Date.now(),
      name: addForm.name,
      impact: parseInt(addForm.impact),
      effort: parseInt(addForm.effort),
      tags: parseTags(addForm.tags)
    };
    setInitiatives([...initiatives, newInitiative]);
    setAddForm({ name: '', impact: 50, effort: 50, tags: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    pushHistory();
    setInitiatives(initiatives.map(i => 
      i.id === editingInitiative.id 
        ? { 
            ...editingInitiative, 
            impact: parseInt(editingInitiative.impact), 
            effort: parseInt(editingInitiative.effort),
            tags: typeof editingInitiative.tags === 'string' ? parseTags(editingInitiative.tags) : editingInitiative.tags
          } 
        : i
    ));
    closeModal();
  };

  const handleDelete = () => {
    pushHistory();
    setInitiatives(initiatives.filter(i => i.id !== editingInitiative.id));
    closeModal();
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ initiatives, exportDate: new Date() }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "roi_matrix_vault_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => fileInputRef.current.click();
  
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.initiatives && Array.isArray(parsed.initiatives)) {
          pushHistory();
          setInitiatives(parsed.initiatives);
        } else {
          alert("Invalid file format. Vault access denied.");
        }
      } catch (err) { console.error(err); alert("Corrupt data stream."); }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset
  };

  // --- Modal Helpers ---
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInitiative(null);
    setDeleteConfirm(false);
  };

  const openModal = (initiative) => {
    setEditingInitiative({ ...initiative, tags: initiative.tags.join(', ') });
    setIsModalOpen(true);
  };

  // --- Drag & Drop Logic ---
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id); // Firefox compat
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedId(null);
  };

  const handleDrop = (e, quadrant) => {
    e.preventDefault();
    if (!draggedId) return;

    const initiative = initiatives.find(i => i.id === draggedId);
    if (initiative) {
      pushHistory();
      let updates = {};
      // Snap to center of quadrant logic
      if (quadrant === 1) updates = { impact: 80, effort: 20 };
      else if (quadrant === 2) updates = { impact: 80, effort: 80 };
      else if (quadrant === 3) updates = { impact: 20, effort: 20 };
      else if (quadrant === 4) updates = { impact: 20, effort: 80 };

      setInitiatives(initiatives.map(i => 
        i.id === draggedId ? { ...i, ...updates } : i
      ));
    }
    setDraggedId(null);
  };

  // --- Analytics & Filtering ---
  const uniqueTags = useMemo(() => {
    const tags = new Set();
    initiatives.forEach(i => i.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [initiatives]);

  const processedInitiatives = useMemo(() => {
    let filtered = initiatives.filter(i => 
      i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTagFilter) {
      filtered = filtered.filter(i => i.tags.includes(activeTagFilter));
    }

    return filtered.sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'roi') {
        valA = parseFloat(getRoi(a.impact, a.effort));
        valB = parseFloat(getRoi(b.impact, b.effort));
      } else if (sortConfig.key === 'impact') {
        valA = a.impact; valB = b.impact;
      } else if (sortConfig.key === 'effort') {
        valA = a.effort; valB = b.effort;
      } else {
        valA = a.name.toLowerCase(); valB = b.name.toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [initiatives, searchTerm, activeTagFilter, sortConfig]);

  const stats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let totalImpact = 0;
    let totalEffort = 0;
    
    initiatives.forEach(i => {
      counts[getQuadrant(i.impact, i.effort)]++;
      totalImpact += i.impact;
      totalEffort += i.effort;
    });

    const avgImpact = initiatives.length ? (totalImpact / initiatives.length).toFixed(0) : 0;
    const avgEffort = initiatives.length ? (totalEffort / initiatives.length).toFixed(0) : 0;
    
    return { counts, avgImpact, avgEffort, total: initiatives.length };
  }, [initiatives]);

  // --- Components ---
  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-3 rounded-xl flex items-center justify-between shadow-lg">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-2 rounded-lg bg-gray-700/50 ${color}`}>
        <Icon size={18} />
      </div>
    </div>
  );

  const Quadrant = ({ id, children }) => {
    const qData = QUADRANTS[id];
    return (
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, id)}
        className={`
          relative flex flex-col gap-2 p-4 rounded-xl transition-all duration-300
          ${qData.bg} ${qData.border} border
          ${draggedId ? 'ring-2 ring-opacity-50 ring-white/20' : ''}
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className={`font-bold text-lg ${qData.color} flex items-center gap-2`}>
              {qData.title}
            </h3>
            <p className="text-xs text-gray-400 opacity-70 mt-1">{qData.desc}</p>
          </div>
          <span className="bg-gray-900/50 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-700 shadow-inner">
            {stats.counts[id]}
          </span>
        </div>
        
        <div className="flex-grow flex flex-col gap-2 min-h-[120px]">
          {initiatives.filter(i => getQuadrant(i.impact, i.effort) === id).map(i => (
            <div
              key={i.id}
              draggable
              onDragStart={(e) => handleDragStart(e, i.id)}
              onDragEnd={handleDragEnd}
              onClick={() => openModal(i)}
              className="group bg-gray-900/80 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 p-2.5 rounded-lg text-white text-sm shadow-md cursor-grab active:cursor-grabbing transition-all flex items-center justify-between"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium">{i.name}</span>
                <div className="flex gap-1 mt-1">
                  {i.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 rounded uppercase tracking-wide">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className={`text-xs font-bold ${getRoi(i.impact, i.effort) > 2 ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {getRoi(i.impact, i.effort)}
                </span>
                <Grip size={14} className="text-gray-600 group-hover:text-cyan-400" />
              </div>
            </div>
          ))}
          {initiatives.filter(i => getQuadrant(i.impact, i.effort) === id).length === 0 && (
            <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-700/30 rounded-lg">
              <span className="text-xs text-gray-600 font-mono">EMPTY SECTOR</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-x-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Top Navigation / Dashboard Header */}
      <header className="max-w-7xl mx-auto mb-8 relative z-10 border-b border-gray-800 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-900/20 p-3 rounded-2xl border border-cyan-500/30">
              <BarChart3 className="text-cyan-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">ROI MATRIX</h1>
              <p className="text-gray-500 text-sm font-mono tracking-wider">PROJECT: GROUND ZERO // VAULT ANALYTICS</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleUndo} disabled={history.length === 0} className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-lg border border-gray-700 transition" title="Undo"><RotateCcw size={20} /></button>
            <button onClick={() => setShowStats(!showStats)} className={`p-2 rounded-lg border border-gray-700 transition ${showStats ? 'bg-cyan-900/30 text-cyan-400 border-cyan-900' : 'bg-gray-800'}`} title="Toggle Stats"><PieChart size={20} /></button>
            <div className="h-10 w-px bg-gray-800 mx-1"></div>
            <input type="file" ref={fileInputRef} onChange={handleImportFile} className="hidden" accept=".json" />
            <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg text-sm font-medium transition text-gray-300 hover:text-white"><Upload size={16} /> Load</button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition"><Download size={16} /> Save to Vault</button>
          </div>
        </div>

        {/* Analytics Bar */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 animate-in slide-in-from-top-4 duration-500">
            <StatCard label="Total Initiatives" value={stats.total} icon={BarChart3} color="text-white" />
            <StatCard label="Avg Impact" value={`${stats.avgImpact}%`} icon={AlertCircle} color="text-emerald-400" />
            <StatCard label="Avg Effort" value={`${stats.avgEffort}%`} icon={Move} color="text-rose-400" />
            <StatCard label="Target Zone (Q1)" value={stats.counts[1]} icon={Check} color="text-cyan-400" />
          </div>
        )}
      </header>

      <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto relative z-10">
        
        {/* Left Column: Input & List */}
        <div className="xl:w-1/3 flex-shrink-0 flex flex-col gap-6">
          
          {/* Add Form */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-cyan-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white">New Entry</h2>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="relative group">
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  className="peer w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pt-5 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-transparent"
                  placeholder="Initiative Name"
                  required
                />
                <label className="absolute left-4 top-1 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-cyan-400">Initiative Name</label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Impact</label>
                    <span className="text-xs font-mono text-cyan-400">{addForm.impact}</span>
                  </div>
                  <input type="range" min="1" max="100" value={addForm.impact} onChange={(e) => setAddForm({...addForm, impact: parseInt(e.target.value)})} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Effort</label>
                    <span className="text-xs font-mono text-rose-400">{addForm.effort}</span>
                  </div>
                  <input type="range" min="1" max="100" value={addForm.effort} onChange={(e) => setAddForm({...addForm, effort: parseInt(e.target.value)})} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={addForm.tags}
                  onChange={(e) => setAddForm({...addForm, tags: e.target.value})}
                  className="peer w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pt-5 text-white outline-none focus:border-cyan-500 transition-all placeholder-transparent"
                  placeholder="Tags"
                />
                <label className="absolute left-4 top-1 text-[10px] uppercase font-bold text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-cyan-400">Tags (comma separated)</label>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2">
                <Save size={18} /> Initialize
              </button>
            </form>
          </div>

          {/* List View */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl flex flex-col flex-grow min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-white">Database</h2>
              </div>
              <div className="flex gap-2">
                {uniqueTags.length > 0 && (
                  <div className="relative group">
                    <button onClick={() => setActiveTagFilter(null)} className={`p-1.5 rounded-md border ${!activeTagFilter ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`} title="Clear Filter"><Filter size={16} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Search database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 rounded-lg text-white px-4 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
              
              {/* Tag Cloud */}
              {uniqueTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded border transition-colors ${
                        activeTagFilter === tag 
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex gap-1 mb-4 bg-gray-800 p-1 rounded-lg">
               {['roi', 'impact', 'effort'].map(key => (
                 <button 
                  key={key}
                  onClick={() => setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                  className={`flex-1 text-[10px] uppercase font-bold py-1.5 rounded-md transition ${sortConfig.key === key ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                 >
                   {key}
                 </button>
               ))}
            </div>

            {/* List */}
            <div className="space-y-2 overflow-y-auto flex-grow pr-1 max-h-[500px] custom-scrollbar">
              {processedInitiatives.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                  <AlertCircle size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-mono">NO DATA FOUND</p>
                </div>
              ) : (
                processedInitiatives.map(i => (
                  <div 
                    key={i.id}
                    onClick={() => openModal(i)}
                    className="group bg-gray-800/30 hover:bg-gray-800 p-3 rounded-lg border border-transparent hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start pl-2">
                      <div>
                        <p className="font-semibold text-gray-200 group-hover:text-white transition-colors text-sm">{i.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-mono">
                          <span>IMP: <span className="text-gray-300">{i.impact}</span></span>
                          <span>EFF: <span className="text-gray-300">{i.effort}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-lg text-purple-400">{getRoi(i.impact, i.effort)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Matrix Visualization */}
        <div className="flex-grow flex flex-col justify-center">
          <div className="relative w-full aspect-square max-h-[700px] mx-auto">
            {/* Axis Labels */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-gray-600 tracking-[0.2em]">IMPACT →</div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-600 tracking-[0.2em]">EFFORT →</div>
            
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 p-4 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl relative overflow-hidden">
               {/* Center Crosshair Decoration */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 z-0 opacity-20 pointer-events-none">
                 <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white"></div>
                 <div className="absolute left-0 right-0 top-1/2 h-px bg-white"></div>
                 <div className="absolute inset-0 border border-white rounded-full"></div>
               </div>

               <Quadrant id={1} />
               <Quadrant id={2} />
               <Quadrant id={3} />
               <Quadrant id={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Edit Modal */}
      {isModalOpen && editingInitiative && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl transform transition-all scale-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Parameters</h2>
                <p className="text-xs text-gray-500 font-mono">ID: {editingInitiative.id}</p>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition bg-gray-800 p-2 rounded-lg"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Initiative Name</label>
                <input
                  type="text"
                  value={editingInitiative.name}
                  onChange={(e) => setEditingInitiative({...editingInitiative, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500 transition font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Impact</label>
                      <span className="text-cyan-400 font-mono font-bold">{editingInitiative.impact}</span>
                    </div>
                    <input
                      type="range" min="1" max="100"
                      value={editingInitiative.impact}
                      onChange={(e) => setEditingInitiative({...editingInitiative, impact: e.target.value})}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Effort</label>
                      <span className="text-rose-400 font-mono font-bold">{editingInitiative.effort}</span>
                    </div>
                    <input
                      type="range" min="1" max="100"
                      value={editingInitiative.effort}
                      onChange={(e) => setEditingInitiative({...editingInitiative, effort: e.target.value})}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={editingInitiative.tags}
                    onChange={(e) => setEditingInitiative({...editingInitiative, tags: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-10 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                {!deleteConfirm ? (
                  <button 
                    type="button" 
                    onClick={() => setDeleteConfirm(true)}
                    className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-2 px-3 py-2 rounded hover:bg-red-900/20 transition"
                  >
                    <Trash2 size={16} /> DELETE
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-red-900/20 px-3 py-2 rounded border border-red-900/50">
                    <span className="text-xs text-red-200 font-bold uppercase">Confirm Deletion?</span>
                    <button type="button" onClick={handleDelete} className="text-red-400 hover:text-white text-xs font-bold underline">YES</button>
                    <button type="button" onClick={() => setDeleteConfirm(false)} className="text-gray-400 hover:text-white text-xs">NO</button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-400 hover:text-white font-medium transition">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/30 transition">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROIMatrix;