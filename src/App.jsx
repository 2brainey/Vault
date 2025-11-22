import React from 'react';
import VaultDashboard from './components/dashboard/dashboard';
function App() {
  return (
    // This div ensures the dark mode background covers the whole screen
    <div className="min-h-screen bg-[#2b3446]">
      <VaultDashboard />
    </div>
  );
}

export default App;