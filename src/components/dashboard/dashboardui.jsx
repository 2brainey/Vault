import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  setDoc,
  getDoc
} from 'firebase/firestore';
// FIX: Added .js extension to ensure resolution in strict build environments
import { db, auth } from '../../config/firebase.js';

[
  {
    "fileName": "src/components/dashboard/inventoryprototype.jsx",
    "patch": "@@ -1,6 +1,6 @@\n import React, { useState } from 'react';\n import { Package, BookOpen, Landmark, DollarSign, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';\n-import { InventoryGrid, CollectionBinder } from './dashboardinterface.jsx'; \n+import { InventoryGrid, CollectionBinder } from './dashboardui'; \n import { RenderIcon } from './dashboardutils'; \n import { INVENTORY_SLOTS, CARD_DATABASE } from '../../data/gamedata'; \n"
  },
  {
    "fileName": "src/components/dashboard/dashboard.jsx",
    "patch": "@@ -1,6 +1,6 @@\n import React, { useState, useEffect, useMemo, useCallback } from 'react';\n import { useGameStore } from '../../store/gamestore'; \n-import { SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, WIDGET_DATABASE, CONSTANTS } from '../../data/gamedata'; \n-import { InventoryGrid, ContractWidget, MasteryModal, InputGroup, InputField } from './dashboardinterface'; \n+import { SHOP_ITEMS, CARD_DATABASE, SKILL_DETAILS, WIDGET_DATABASE, CONSTANTS } from '../../data/gamedata'; \n+import { InventoryGrid, ContractWidget, MasteryModal, InputGroup, InputField } from './dashboardui'; \n import { RenderIcon } from './dashboardutils';\n import ShopFullPage from './shopfullpage'; \n import EstatePrototype from './estateprototype';"
  }
]

// Import Icons and Chart components
import { Sun, Moon, Download, Search, ChevronUp, ChevronDown, DollarSign, Calendar, Settings, Plus, Trash2, X, Save, Database } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// --- Constants & Config ---
const DEFAULT_FIELDS = [
  { key: 'name', label: 'Project Name', type: 'text', system: true, required: true },
  { key: 'status', label: 'Status', type: 'select', system: true, options: ['Active', 'Complete', 'On Hold', 'Pending'] },
  { key: 'priority', label: 'Priority', type: 'select', system: true, options: ['High', 'Medium', 'Low'] },
  { key: 'budget', label: 'Budget ($)', type: 'number', system: false },
  { key: 'owner', label: 'Owner', type: 'text', system: false },
  { key: 'dueDate', label: 'Due Date', type: 'date', system: false },
  { key: 'description', label: 'Description', type: 'textarea', system: false },
];

const STATUS_COLORS = {
    'Active': '#4F46E5', 'Complete': '#10B981', 'On Hold': '#F59E0B', 'Pending': '#EF4444',
};
const PRIORITY_COLORS = {
    'High': '#EF4444', 'Medium': '#FBBF24', 'Low': '#34D399',
};

// --- Utilities ---
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-20 right-4 z-[100] p-4 rounded-lg shadow-xl text-white ${
    type === 'success' ? 'bg-green-600 border border-green-400' : type === 'error' ? 'bg-red-600 border border-red-400' : 'bg-blue-600 border border-blue-400'
  } transition-opacity duration-300 flex items-center gap-3`} onClick={onClose}>
    <span>{message}</span>
    <button className="font-bold hover:text-gray-200">&times;</button>
  </div>
);

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (dateObj) => {
    if (!dateObj) return '-';
    // Firestore timestamp or Date object
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
};

// --- Sub-Components ---

const AnalyticsPanel = ({ records }) => {
    const totalBudget = records.reduce((sum, r) => sum + (parseFloat(r.budget) || 0), 0);
    const activeProjects = records.filter(r => r.status === 'Active').length;

    const statusData = useMemo(() => {
        const counts = {};
        records.forEach(r => counts[r.status] = (counts[r.status] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [records]);

    const priorityData = useMemo(() => {
        const counts = {};
        records.forEach(r => counts[r.priority] = (counts[r.priority] || 0) + 1);
        return Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
    }, [records]);

    const KpiCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-[#1e1e1e] border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-lg">
            <div className={`p-3 rounded-full bg-black/30`} style={{ color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{title}</p>
                <p className="text-2xl font-mono font-bold text-white">{value}</p>
            </div>
        </div>
    );

    const ChartCard = ({ title, data, colorMap }) => (
        <div className="bg-[#1e1e1e] border border-slate-700 p-4 rounded-xl flex flex-col h-64 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">{title}</h3>
            <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colorMap[entry.name] || '#8884d8'} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} itemStyle={{ color: '#F3F4F6' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Total Budget" value={formatCurrency(totalBudget)} icon={DollarSign} color="#10B981" />
                <KpiCard title="Active Projects" value={activeProjects} icon={Calendar} color="#4F46E5" />
            </div>
            {records.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ChartCard title="Status Distribution" data={statusData} colorMap={STATUS_COLORS} />
                    <ChartCard title="Priority Distribution" data={priorityData} colorMap={PRIORITY_COLORS} />
                </div>
            )}
        </div>
    );
};

const FieldManager = ({ isOpen, onClose, fields, onSave }) => {
    const [localFields, setLocalFields] = useState(fields);
    const [newField, setNewField] = useState({ label: '', type: 'text' });

    useEffect(() => { setLocalFields(fields); }, [fields, isOpen]);

    const handleAddField = () => {
        if (!newField.label.trim()) return;
        const key = newField.label.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + Date.now().toString().slice(-4);
        setLocalFields([...localFields, { ...newField, key, system: false }]);
        setNewField({ label: '', type: 'text' });
    };

    const handleDeleteField = (key) => {
        setLocalFields(localFields.filter(f => f.key !== key));
    };

    const handleLabelChange = (key, newLabel) => {
        setLocalFields(localFields.map(f => f.key === key ? { ...f, label: newLabel } : f));
    };

    const saveChanges = () => {
        onSave(localFields);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#1e1e1e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-white">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings size={20} className="text-indigo-500" /> Manage Database Fields
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-dashed border-slate-600">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Add New Field</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text" placeholder="Field Name" 
                                value={newField.label} onChange={(e) => setNewField({...newField, label: e.target.value})}
                                className="flex-1 p-2 rounded border bg-slate-900 border-slate-700 text-white focus:border-indigo-500 outline-none"
                            />
                            <select 
                                value={newField.type} onChange={(e) => setNewField({...newField, type: e.target.value})}
                                className="p-2 rounded border bg-slate-900 border-slate-700 text-white focus:border-indigo-500 outline-none"
                            >
                                <option value="text">Short Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="textarea">Long Description</option>
                            </select>
                            <button onClick={handleAddField} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 font-medium transition-colors">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Current Fields</h3>
                        <div className="space-y-2">
                            {localFields.map((field) => (
                                <div key={field.key} className="flex items-center gap-3 p-3 rounded border bg-slate-800/30 border-slate-700">
                                    <div className={`p-2 rounded ${field.system ? 'bg-indigo-900/30 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                                        {field.type === 'number' ? <DollarSign size={16} /> : field.type === 'date' ? <Calendar size={16} /> : <span className="text-xs font-bold font-mono">Tx</span>}
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            type="text" value={field.label} onChange={(e) => handleLabelChange(field.key, e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 outline-none text-white font-medium"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-0.5">Type: {field.type} {field.system && '• System Field'}</p>
                                    </div>
                                    {!field.system && (
                                        <button onClick={() => handleDeleteField(field.key)} className="text-red-400 hover:text-red-300 p-2 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded font-medium hover:bg-slate-700 text-slate-300 transition-colors">Cancel</button>
                    <button onClick={saveChanges} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-2 shadow-lg transition-colors">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Interface Component ---
const DatabaseInterface = () => {
  const [userId, setUserId] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Fields State
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [isFieldManagerOpen, setIsFieldManagerOpen] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const showToast = useCallback((message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); }, []);

  // --- Auth & Init ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
            await signInAnonymously(auth);
        } catch (e) {
            console.error("Auth error:", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Load Data & Schema ---
  useEffect(() => {
    if (!db || !userId) return;

    // Use a cleaner collection path for the main app
    const dataPath = `users/${userId}/vault_projects`;
    const settingsPath = `users/${userId}/vault_settings`;

    // 1. Load Records
    const unsubscribeData = onSnapshot(query(collection(db, dataPath)), (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
      })));
      setLoading(false);
    }, (error) => {
        console.error("Data load error:", error);
        setLoading(false);
    });

    // 2. Load Schema (Custom Fields)
    const schemaRef = doc(db, settingsPath, 'schema');
    getDoc(schemaRef).then(snap => {
        if (snap.exists() && snap.data().fields) {
            setFields(snap.data().fields);
        }
    });

    return () => unsubscribeData();
  }, [userId]);

  // --- Handlers ---
  const handleSaveSchema = async (newFields) => {
      setFields(newFields);
      if (db && userId) {
          try {
              await setDoc(doc(db, `users/${userId}/vault_settings`, 'schema'), { fields: newFields });
              showToast("Database schema updated successfully");
          } catch (e) {
              console.error(e);
              showToast("Failed to save schema", 'error');
          }
      }
  };

  const handleFormChange = (key, value) => {
    setCurrentRecord(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
      setIsEditing(false);
      const empty = {};
      fields.forEach(f => {
          if (f.key === 'status') empty.status = 'Active';
          else if (f.key === 'priority') empty.priority = 'Medium';
          else empty[f.key] = '';
      });
      setCurrentRecord(empty);
  };

  useEffect(() => { if (!isEditing) resetForm(); }, [fields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db || !userId) return showToast("Auth not ready", 'error');
    if (!currentRecord.name?.trim()) return showToast("Project Name is required", 'error');

    const payload = {};
    fields.forEach(f => {
        let val = currentRecord[f.key];
        if (f.type === 'number') val = parseFloat(val) || 0;
        if (typeof val === 'string') val = val.trim();
        payload[f.key] = val;
    });

    try {
      const colRef = collection(db, `users/${userId}/vault_projects`);
      if (isEditing && currentRecord.id) {
        await updateDoc(doc(colRef, currentRecord.id), payload);
        showToast("Record updated");
      } else {
        await addDoc(colRef, { ...payload, createdAt: serverTimestamp() });
        showToast("Record created");
      }
      resetForm();
    } catch (e) {
      console.error(e);
      showToast("Save failed", 'error');
    }
  };

  const deleteRecord = async (id) => {
      if (!db || !userId) return;
      try {
          await deleteDoc(doc(db, `users/${userId}/vault_projects`, id));
          showToast("Record deleted");
      } catch (e) { console.error(e); showToast("Delete failed", 'error'); }
  };

  const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
      setSortConfig({ key, direction });
  };

  const processedRecords = useMemo(() => {
      let data = [...records];
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          data = data.filter(r => fields.some(f => String(r[f.key] || '').toLowerCase().includes(lower)));
      }
      data.sort((a, b) => {
          let aVal = a[sortConfig.key];
          let bVal = b[sortConfig.key];
          if (typeof aVal === 'string') aVal = aVal.toLowerCase();
          if (typeof bVal === 'string') bVal = bVal.toLowerCase();
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
      return data;
  }, [records, searchTerm, sortConfig, fields]);

  // --- Renderers ---
  const renderInput = (field) => {
      const val = currentRecord[field.key] || '';
      const baseClass = "w-full p-2 rounded border focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-900 border-slate-700 text-white";

      if (field.type === 'select') {
          return (
              <select value={val} onChange={e => handleFormChange(field.key, e.target.value)} className={baseClass}>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
          );
      }
      if (field.type === 'textarea') {
          return (
              <textarea value={val} onChange={e => handleFormChange(field.key, e.target.value)} className={`${baseClass} h-24 resize-none`} placeholder={`Enter ${field.label}...`}></textarea>
          );
      }
      return (
          <input 
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} 
            value={val} 
            onChange={e => handleFormChange(field.key, e.target.value)} 
            className={baseClass} 
            placeholder={field.type === 'number' ? '0.00' : ''}
            step={field.type === 'number' ? '0.01' : undefined}
          />
      );
  };

  return (
    <div className="h-full flex flex-col bg-[#0f1219] overflow-hidden">
        {/* Modals */}
        <FieldManager 
            isOpen={isFieldManagerOpen} 
            onClose={() => setIsFieldManagerOpen(false)} 
            fields={fields} 
            onSave={handleSaveSchema} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 border-slate-700 flex justify-between items-center">
                            {isEditing ? 'Edit Record' : 'New Entry'}
                            {isEditing && <button onClick={resetForm} className="text-xs font-normal text-indigo-400 hover:underline">Reset</button>}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map(field => (
                                <div key={field.key}>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {renderInput(field)}
                                </div>
                            ))}
                            <div className="pt-2 flex gap-2">
                                <button type="submit" className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors">
                                    {isEditing ? 'Update Entry' : 'Create Entry'}
                                </button>
                                {isEditing && <button type="button" onClick={resetForm} className="px-4 border border-slate-600 rounded text-slate-300 hover:bg-slate-700">Cancel</button>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Analytics & Data */}
                <div className="lg:col-span-8 space-y-6">
                    <AnalyticsPanel records={records} />

                    <div className="bg-[#1e1e1e] rounded-lg shadow-xl border border-slate-700 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#1a1a1a]">
                            <div className="relative w-full sm:w-64">
                                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input 
                                    type="text" placeholder="Search..." 
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => setIsFieldManagerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-colors border border-slate-600">
                                    <Settings size={16} /> Edit Fields
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-700">
                                <thead className="bg-slate-800">
                                    <tr>
                                        {fields.map(field => (
                                            <th key={field.key} onClick={() => handleSort(field.key)} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-700 select-none whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    {field.label}
                                                    {sortConfig.key === field.key ? (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>) : <div className="w-3.5"/>}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#1e1e1e] divide-y divide-slate-700">
                                    {processedRecords.length === 0 ? (
                                        <tr><td colSpan={fields.length + 1} className="px-6 py-8 text-center text-slate-500 italic">No records found.</td></tr>
                                    ) : (
                                        processedRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-800/50 transition-colors group">
                                                {fields.map(field => (
                                                    <td key={field.key} className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                                                        {field.key === 'status' ? (
                                                            <span className="px-2 py-1 text-xs rounded-full font-bold" style={{ backgroundColor: `${STATUS_COLORS[record[field.key]]}20`, color: STATUS_COLORS[record[field.key]] }}>
                                                                {record[field.key]}
                                                            </span>
                                                        ) : field.key === 'priority' ? (
                                                            <span className="font-bold" style={{ color: PRIORITY_COLORS[record[field.key]] }}>{record[field.key]}</span>
                                                        ) : field.type === 'number' ? (
                                                            <span className="font-mono text-emerald-400">{field.label.includes('$') || field.key === 'budget' ? formatCurrency(record[field.key] || 0) : record[field.key]}</span>
                                                        ) : field.type === 'date' ? (
                                                            formatDate(record[field.key])
                                                        ) : (
                                                            <span className="truncate block max-w-[200px]" title={record[field.key]}>{record[field.key] || '-'}</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setIsEditing(true); setCurrentRecord(record); }} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                                        <button onClick={() => deleteRecord(record.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DatabaseInterface;