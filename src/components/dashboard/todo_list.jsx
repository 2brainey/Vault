import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

export default function TodoList() {
  // --- Data Management ---
  const getProfileData = () => {
    try {
      const saved = localStorage.getItem('todo_profile_data');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  };

  const saveProfileData = (data) => {
    localStorage.setItem('todo_profile_data', JSON.stringify(data));
  };

  // --- State ---
  const [todoState, setTodoState] = useState(() => {
    const profile = getProfileData();
    if (profile.todoState) return profile.todoState;
    const defaultListId = Date.now();
    return {
      lists: [{ id: defaultListId, name: 'My To-Do List', tasks: [] }],
      activeListId: defaultListId,
      activeFilter: 'all'
    };
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const newListInputRef = useRef(null);

  useEffect(() => {
    const profile = getProfileData();
    profile.todoState = todoState;
    saveProfileData(profile);
  }, [todoState]);

  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  // --- Helpers ---
  const getActiveList = () => todoState.lists.find(l => l.id === todoState.activeListId) || todoState.lists[0];
  const activeList = getActiveList();

  const getFilteredTasks = () => {
    if (!activeList) return [];
    const tasks = activeList.tasks.filter(task => {
      if (todoState.activeFilter === 'active') return !task.completed;
      if (todoState.activeFilter === 'completed') return task.completed;
      return true;
    });
    if (draggedItem && !tasks.find(t => t.id === draggedItem.id)) {
        return [...tasks, draggedItem];
    }
    return tasks;
  };

  // --- Actions ---
  const switchTab = (id) => setTodoState(prev => ({ ...prev, activeListId: id }));
  
  const confirmAddList = (listName) => {
    const name = listName.trim();
    if (name) {
      const newListId = Date.now();
      setTodoState(prev => ({
        ...prev,
        lists: [...prev.lists, { id: newListId, name, tasks: [] }],
        activeListId: newListId
      }));
    }
    setIsAddingList(false);
  };

  const updateListTitle = (newTitle) => {
    setTodoState(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === activeList.id ? { ...l, name: newTitle.trim() } : l)
    }));
    setEditingTitle(false);
  };

  const addTask = (text) => {
    if (!text.trim()) return;
    const newTask = { id: Date.now(), text: text.trim(), completed: false };
    setTodoState(prev => ({
      ...prev,
      lists: prev.lists.map(l => 
        l.id === activeList.id ? { ...l, tasks: [...l.tasks, newTask] } : l
      )
    }));
  };

  const toggleTask = (taskId) => {
    setTodoState(prev => ({
      ...prev,
      lists: prev.lists.map(l => 
        l.id === activeList.id ? {
          ...l,
          tasks: l.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        } : l
      )
    }));
  };

  const deleteTask = (taskId) => {
    setTodoState(prev => ({
      ...prev,
      lists: prev.lists.map(l => 
        l.id === activeList.id ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l
      )
    }));
  };

  const updateTaskText = (taskId, newText) => {
    setTodoState(prev => ({
      ...prev,
      lists: prev.lists.map(l => 
        l.id === activeList.id ? {
          ...l,
          tasks: l.tasks.map(t => t.id === taskId ? { ...t, text: newText.trim() } : t)
        } : l
      )
    }));
    setEditingTaskId(null);
  };

  const setFilter = (filter) => setTodoState(prev => ({ ...prev, activeFilter: filter }));

  // --- Drag & Drop ---
  const handleDragStart = (e, task) => {
    setDraggedItem(task);
    setTimeout(() => e.target.classList.add('opacity-50'), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedItem(null);
    setTodoState(prev => ({ ...prev }));
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('li:not(.opacity-50)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);
    
    setTodoState(prev => {
      const tasks = [...activeList.tasks]; 
      const draggedTaskIndex = tasks.findIndex(t => t.id === draggedItem.id);
      if (draggedTaskIndex === -1) return prev;

      tasks.splice(draggedTaskIndex, 1); 
      
      if (afterElement == null) {
        tasks.push(draggedItem);
      } else {
        const afterTaskId = Number(afterElement.dataset.taskId);
        let afterIndex = tasks.findIndex(t => t.id === afterTaskId);
        if (afterIndex === -1) afterIndex = tasks.length;
        tasks.splice(afterIndex, 0, draggedItem);
      }
      
      return { ...prev, lists: prev.lists.map(l => l.id === activeList.id ? { ...l, tasks } : l) };
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1f2937] text-[#f3f4f6] rounded-lg p-6 border border-[#374151] font-sans">
      {/* Header / Title */}
      <header className="mb-4">
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            className="w-full text-2xl font-bold bg-[#111827] border border-[#374151] rounded p-1 text-[#f3f4f6]"
            defaultValue={activeList.name}
            onBlur={(e) => updateListTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateListTitle(e.currentTarget.value)}
          />
        ) : (
          <div 
            className="text-2xl font-bold cursor-pointer hover:bg-[#111827] p-1 rounded"
            onClick={() => setEditingTitle(true)}
          >
            {activeList.name}
          </div>
        )}
      </header>

      {/* Tabs / Add List Input */}
      <div className="flex border-b border-[#374151] mb-4">
        {isAddingList ? (
          <div className="flex flex-grow items-center gap-2 py-2">
            <input
              ref={newListInputRef}
              type="text"
              className="w-full bg-[#1f2937] border border-[#4b5563] rounded-md px-3 py-2 text-white"
              placeholder={`New List Name`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAddList(e.currentTarget.value);
                if (e.key === 'Escape') setIsAddingList(false);
              }}
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md" onClick={() => confirmAddList(newListInputRef.current.value)}><Plus size={16} /></button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md" onClick={() => setIsAddingList(false)}><X size={16} /></button>
          </div>
        ) : (
          <>
            <nav className="flex-grow flex items-center overflow-x-auto">
              {todoState.lists.map(list => (
                <button
                  key={list.id}
                  className={`px-4 py-2 cursor-pointer border-b-2 bg-transparent transition-all whitespace-nowrap ${list.id === todoState.activeListId ? 'text-[#9333ea] border-[#9333ea] font-bold' : 'text-[#9ca3af] border-transparent hover:text-[#f3f4f6]'}`}
                  onClick={() => switchTab(list.id)}
                >
                  {list.name}
                </button>
              ))}
            </nav>
            <button className="ml-2 text-[#9ca3af] hover:text-[#f3f4f6] p-2" onClick={() => setIsAddingList(true)}><Plus size={20} /></button>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          id="task-input"
          className="w-full bg-[#1f2937] border border-[#4b5563] rounded-md px-3 py-2 text-white"
          placeholder="Add a new task..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') { addTask(e.currentTarget.value); e.currentTarget.value = ''; }
          }}
        />
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => {
            const input = document.getElementById('task-input');
            addTask(input.value);
            input.value = '';
          }}
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="flex-grow overflow-y-auto p-0 m-0 list-none" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {getFilteredTasks().map(task => (
          <li
            key={task.id}
            data-task-id={task.id}
            className={`bg-[#111827] mb-2 p-3 rounded flex items-center gap-3 cursor-grab active:cursor-grabbing ${task.completed ? 'line-through text-[#9ca3af]' : ''} ${draggedItem?.id === task.id ? 'opacity-50 border border-[#9333ea] border-dashed' : ''}`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, task)}
            onDragEnd={handleDragEnd}
          >
            <input type="checkbox" className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500" checked={task.completed} onChange={() => toggleTask(task.id)} />
            
            {editingTaskId === task.id ? (
              <input
                autoFocus
                type="text"
                className="bg-[#374151] text-[#f3f4f6] border border-[#374151] rounded px-1 flex-grow"
                defaultValue={task.text}
                onBlur={(e) => updateTaskText(task.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateTaskText(task.id, e.currentTarget.value)}
              />
            ) : (
              <span className="flex-grow" onDoubleClick={() => setEditingTaskId(task.id)}>{task.text}</span>
            )}

            <button className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors" onClick={() => deleteTask(task.id)}><X size={16} /></button>
          </li>
        ))}
      </ul>

      {/* Filters */}
      <div className="flex justify-center gap-2 mt-4">
        {['all', 'active', 'completed'].map(filter => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-md border transition-all capitalize ${todoState.activeFilter === filter ? 'bg-[#9333ea] text-white border-[#9333ea]' : 'text-[#9ca3af] border-[#374151] hover:border-[#f3f4f6]'}`}
            onClick={() => setFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}