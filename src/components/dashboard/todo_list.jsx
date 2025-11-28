import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

export default function TodoList() {
  // --- Data Management (Mocking getProfileData/saveProfileData) ---
  const getProfileData = () => {
    try {
      const saved = localStorage.getItem('todo_profile_data');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  };

  const saveProfileData = (data) => {
    localStorage.setItem('todo_profile_data', JSON.stringify(data));
  };

  // --- State Initialization ---
  const [todoState, setTodoState] = useState(() => {
    const profile = getProfileData();
    if (profile.todoState) {
      return profile.todoState;
    }
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
  const [isAddingList, setIsAddingList] = useState(false); // NEW STATE for list input
  const newListInputRef = useRef(null);
  
  // Persist state whenever it changes
  useEffect(() => {
    const profile = getProfileData();
    profile.todoState = todoState;
    saveProfileData(profile);
  }, [todoState]);

  // Focus the new list input when the state changes
  useEffect(() => {
    if (isAddingList && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [isAddingList]);

  // --- Helpers ---
  const getActiveList = () => {
    return todoState.lists.find(l => l.id === todoState.activeListId) || todoState.lists[0];
  };

  const activeList = getActiveList();

  const getFilteredTasks = () => {
    if (!activeList) return [];
    // Ensure that if the dragged item is being filtered out, it still shows up during drag
    const tasks = activeList.tasks.filter(task => {
      if (todoState.activeFilter === 'active') return !task.completed;
      if (todoState.activeFilter === 'completed') return task.completed;
      return true;
    });
    
    // Check if the dragged item is present in the filtered list
    if (draggedItem && !tasks.find(t => t.id === draggedItem.id)) {
        // If the dragged item is currently hidden by the filter, temporarily add it back
        // This prevents the task list from shrinking/flickering during drag
        return [...tasks, draggedItem];
    }
    
    return tasks;
  };

  // --- Actions ---
  const switchTab = (id) => {
    setTodoState(prev => ({ ...prev, activeListId: id }));
  };

  // REPLACED: No longer uses prompt()
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
        l.id === activeList.id ? {
          ...l,
          tasks: l.tasks.filter(t => t.id !== taskId)
        } : l
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

  const setFilter = (filter) => {
    setTodoState(prev => ({ ...prev, activeFilter: filter }));
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, task) => {
    setDraggedItem(task);
    // Timeout to allow the ghost image to be created before hiding the element
    setTimeout(() => e.target.classList.add('dragging'), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
    // Ensure tasks are re-rendered based on filter after drag ends
    setTodoState(prev => ({ ...prev }));
  };

  const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    
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
  
  // React-friendly Drop Handler to commit the change
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);
    
    setTodoState(prev => {
      const newList = { ...activeList };
      // Use the tasks array from the state, which is the complete, unfiltered list
      const tasks = [...activeList.tasks]; 
      
      const draggedTaskIndex = tasks.findIndex(t => t.id === draggedItem.id);
      if (draggedTaskIndex === -1) return prev; // Should not happen

      tasks.splice(draggedTaskIndex, 1); // Remove dragged item
      
      if (afterElement == null) {
        // Drop at the end
        tasks.push(draggedItem);
      } else {
        const afterTaskId = Number(afterElement.dataset.taskId);
        // Find the index of the element we are dropping before in the modified tasks array
        let afterIndex = tasks.findIndex(t => t.id === afterTaskId);

        // If afterIndex is -1, it means the element is not in the full list (e.g., if it was dragged from a filtered list).
        // Since we are iterating over visible elements, afterElement should always correspond to a task in the full list.
        if (afterIndex === -1) {
            // Fallback: If not found, place at the start/end depending on where the drop occurred
            afterIndex = tasks.length;
        }
        
        tasks.splice(afterIndex, 0, draggedItem); // Insert dragged item
      }
      
      return {
        ...prev,
        lists: prev.lists.map(l => l.id === activeList.id ? { ...l, tasks } : l)
      };
    });
  };

  // --- Render Components ---

  return (
    <div className="todo-widget">
      <style>{`
        /* CSS Variables & Base Styles from your file */
        :root {
          --card-bg-color: #1f2937;
          --text-color: #f3f4f6;
          --subtle-text-color: #9ca3af;
          --input-border-color: #374151;
          --item-bg-color: #111827;
          --input-focus-color: #9333ea;
          --background-color: #374151;
        }

        .todo-widget {
          background-color: var(--card-bg-color);
          color: var(--text-color);
          border-radius: 0.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid var(--input-border-color);
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .list-tabs {
          display: flex;
          border-bottom: 1px solid var(--input-border-color);
          margin-bottom: 1rem;
        }

        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          background: none;
          border: none;
          color: var(--subtle-text-color);
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .tab.active {
          color: var(--input-focus-color);
          border-bottom-color: var(--input-focus-color);
          font-weight: 600;
        }

        .add-list-btn {
          background: none;
          border: none;
          color: var(--subtle-text-color);
          cursor: pointer;
          padding: 0.5rem;
          font-size: 1.5rem;
          line-height: 1;
          margin-left: 0.5rem;
        }
        .add-list-btn:hover { color: var(--text-color); }

        .list-title {
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          min-height: 40px;
          display: block;
        }
        .list-title:hover { background-color: var(--item-bg-color); }

        .edit-title-input {
          font-size: 1.5rem;
          font-weight: bold;
          background: var(--item-bg-color);
          border: 1px solid var(--input-border-color);
          border-radius: 0.25rem;
          color: var(--text-color);
          padding: 0.25rem;
          width: 100%;
        }

        .task-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
          flex-grow: 1;
          overflow-y: auto;
        }

        .task-list li {
          background-color: var(--item-bg-color);
          margin-bottom: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: grab;
        }
        .task-list li:active { cursor: grabbing; }

        .task-list li.completed span {
          text-decoration: line-through;
          color: var(--subtle-text-color);
        }

        .task-list li.dragging { opacity: 0.5; border: 1px dashed var(--input-focus-color); }

        .delete-btn {
          margin-left: auto;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .delete-btn:hover { background: #dc2626; }

        .filter-btn {
          color: var(--subtle-text-color);
          background: none;
          border: 1px solid var(--input-border-color);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover { border-color: var(--text-color); }
        .filter-btn.active {
          background-color: var(--input-focus-color);
          color: white;
          border-color: var(--input-focus-color);
        }

        .edit-input {
          background: var(--background-color);
          color: var(--text-color);
          border: 1px solid var(--input-border-color);
          border-radius: 3px;
          flex-grow: 1;
          padding: 2px 5px;
        }
        
        /* Utility overrides to match Tailwind classes used in HTML */
        .w-full { width: 100%; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .rounded-md { border-radius: 0.375rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .bg-gray-800 { background-color: #1f2937; }
        .border-gray-600 { border-color: #4b5563; }
        .bg-purple-600 { background-color: #9333ea; }
        .bg-red-600 { background-color: #dc2626; }
        .hover\:bg-red-700:hover { background-color: #b91c1c; }
        .text-white { color: white; }
        .font-bold { font-weight: 700; }
        .flex-grow { flex-grow: 1; }
        .justify-center { justify-content: center; }
        .mt-4 { margin-top: 1rem; }
        .overflow-x-auto { overflow-x: auto; }
      `}</style>

      {/* Header / Title */}
      <header className="mb-4">
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            className="edit-title-input"
            defaultValue={activeList.name}
            onBlur={(e) => updateListTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateListTitle(e.currentTarget.value)}
          />
        ) : (
          <div 
            id="list-title-container" 
            className="list-title" 
            onClick={() => setEditingTitle(true)}
          >
            {activeList.name}
          </div>
        )}
      </header>

      {/* Tabs / Add List Input */}
      <div className="list-tabs">
        {isAddingList ? (
          <div className="flex flex-grow items-center gap-2 py-2">
            <input
              ref={newListInputRef}
              type="text"
              className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
              placeholder={`New List Name (e.g., List #${todoState.lists.length + 1})`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAddList(e.currentTarget.value);
                if (e.key === 'Escape') setIsAddingList(false);
              }}
            />
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={() => confirmAddList(newListInputRef.current.value)}
            >
              <Plus size={16} />
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
              onClick={() => setIsAddingList(false)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <nav id="list-tab-container" className="flex-grow flex items-center overflow-x-auto">
              {todoState.lists.map(list => (
                <button
                  key={list.id}
                  className={`tab ${list.id === todoState.activeListId ? 'active' : ''}`}
                  onClick={() => switchTab(list.id)}
                >
                  {list.name}
                </button>
              ))}
            </nav>
            <button 
              id="add-list-btn" 
              className="add-list-btn" 
              title="Add New List"
              onClick={() => setIsAddingList(true)}
            >
              <Plus size={20} />
            </button>
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          id="task-input"
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
          placeholder="Add a new task..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTask(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <button
          id="add-task-btn"
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
      <ul 
        id="task-list" 
        className="task-list"
        onDragOver={(e) => e.preventDefault()} // Must call preventDefault here for drop to work
        onDrop={handleDrop}
      >
        {getFilteredTasks().map(task => (
          <li
            key={task.id}
            data-task-id={task.id}
            className={`${task.completed ? 'completed' : ''} ${draggedItem?.id === task.id ? 'dragging' : ''}`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, task)}
            onDragEnd={handleDragEnd}
          >
            <input
              type="checkbox"
              className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            
            {editingTaskId === task.id ? (
              <input
                autoFocus
                type="text"
                className="edit-input flex-grow"
                defaultValue={task.text}
                onBlur={(e) => updateTaskText(task.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateTaskText(task.id, e.currentTarget.value)}
              />
            ) : (
              <span 
                className="flex-grow" 
                onDoubleClick={() => setEditingTaskId(task.id)}
              >
                {task.text}
              </span>
            )}

            <button 
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>

      {/* Filters */}
      <div id="filter-container" className="flex justify-center gap-2 mt-4">
        {['all', 'active', 'completed'].map(filter => (
          <button
            key={filter}
            className={`filter-btn ${todoState.activeFilter === filter ? 'active' : ''}`}
            onClick={() => setFilter(filter)}
            style={{ textTransform: 'capitalize' }}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}