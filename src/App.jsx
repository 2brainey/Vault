import React, { useState, useEffect } from 'react';

// --- SVG Icons (as components for reusability) ---
const SunIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const PlusCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const Trash2Icon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CalendarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);


// --- Reusable Components ---
const DashboardCard = ({ title, icon, children, className = "" }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col ${className}`}>
    <div className="flex items-center mb-4">
      {icon && React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-indigo-400" })}
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

// --- Dashboard Widgets ---

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white">Good Morning, Alex</h1>
      <p className="text-lg text-gray-400 mt-1">
        {formatDate(time)} - {time.toLocaleTimeString()}
      </p>
    </div>
  );
};

const WeatherWidget = () => {
  // This is static data. We will make this live in the next step.
  const weatherData = {
    temp: 72,
    condition: 'Sunny',
    location: 'Warren, Michigan',
    icon: '01d', // OpenWeatherMap icon code for clear sky day
  };

  return (
    <DashboardCard title="Current Weather" icon={<SunIcon />}>
      <div className="flex items-center justify-between h-full">
        <div>
          <p className="text-5xl font-bold text-white">{weatherData.temp}°F</p>
          <p className="text-gray-300 capitalize">{weatherData.condition}</p>
          <p className="text-gray-400 text-sm">{weatherData.location}</p>
        </div>
        <img 
          src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
          alt={weatherData.condition}
          className="w-20 h-20"
        />
      </div>
    </DashboardCard>
  );
};

const TodoListWidget = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Finalize project proposal', completed: false },
        { id: 2, text: 'Call the design team for a sync-up', completed: false },
        { id: 3, text: 'Book flight for the upcoming conference', completed: true },
    ]);
    const [newTask, setNewTask] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim() === '') return;
        const newTaskObject = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        setTasks([newTaskObject, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(
            tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <DashboardCard title="To-Do List" icon={<CheckCircleIcon />} className="row-span-2">
            <div className="flex flex-col h-full">
                <form onSubmit={handleAddTask} className="flex items-center mb-4">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="ml-2 p-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                        <PlusCircleIcon className="w-8 h-8"/>
                    </button>
                </form>
                <div className="overflow-y-auto flex-grow pr-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors group">
                            <div className="flex items-center cursor-pointer" onClick={() => toggleTask(task.id)}>
                                <div className={`w-5 h-5 rounded-full border-2 ${task.completed ? 'border-indigo-500 bg-indigo-500' : 'border-gray-500'} flex items-center justify-center mr-3`}>
                                   {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className={`text-gray-200 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.text}
                                </span>
                            </div>
                            <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2Icon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardCard>
    );
};

const CalendarWidget = () => {
    const events = [
        { time: '10:00 AM', title: 'Marketing Team Sync', location: 'Virtual' },
        { time: '1:00 PM', title: 'Lunch with Sarah', location: 'The Downtown Cafe' },
        { time: '3:30 PM', title: 'Dentist Appointment', location: 'Dr. Smith\'s Office' },
    ];

    return (
        <DashboardCard title="Upcoming Events" icon={<CalendarIcon />} className="row-span-2">
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                           <div className="w-12 text-center bg-indigo-500/20 text-indigo-300 rounded-md px-2 py-1 text-sm font-semibold">
                                {event.time.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-400">{event.time.split(' ')[1]}</div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-100">{event.title}</p>
                            <p className="text-sm text-gray-400">{event.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

const NotesWidget = () => (
    <DashboardCard title="Quick Notes">
        <textarea
            placeholder="Jot down a quick thought..."
            className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none placeholder-gray-500"
        ></textarea>
    </DashboardCard>
);

const QuickActionsWidget = () => {
    const actions = [
        { label: 'New Document', icon: <PlusCircleIcon className="w-6 h-6 mx-auto mb-2"/> },
        { label: 'Upload File', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> },
        { label: 'New Project', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
        { label: 'Share Board', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mx-auto mb-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> },
    ];

    return (
        <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                {actions.map((action, index) => (
                    <button key={index} className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium py-4 px-2 rounded-lg transition-colors flex flex-col justify-center items-center">
                        {action.icon}
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
        </DashboardCard>
    )
};


// --- Main App Component ---
export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <WeatherWidget />
          </div>
          <div className="lg:col-span-2">
            <NotesWidget />
          </div>
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>
          <div className="lg:col-span-2">
            <TodoListWidget />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <QuickActionsWidget />
          </div>
        </main>
      </div>
    </div>
  );
}
