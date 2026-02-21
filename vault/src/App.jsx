// 2brainey/vault/Vault-c56edab4e9ba95c3fc4abb92c22f46eb83c3b7f6/src/App.jsx

import React from 'react';
import VaultDashboard from './components/dashboard/dashboard';
function App() {
  return (
    // Use the custom class 'bg-vault-dark' defined in tailwind.config.js
    <div className="min-h-screen bg-vault-dark"> 
      <VaultDashboard />
    </div>
  );
}

export default App;