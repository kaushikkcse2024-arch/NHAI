import { useState } from 'react';
import './App.css';
import { LayoutDashboard, Camera, Settings, Activity } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ImageAnalyzer from './components/ImageAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container flex-center gap-3">
          <Activity color="var(--accent-cyan)" size={32} />
          <div>
            <h2 className="text-gradient" style={{ margin: 0 }}>LuminaTrack</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>NHAI Hackathon</span>
          </div>
        </div>

        <nav>
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
          >
            <Camera size={20} />
            <span>Image Analyzer</span>
          </div>
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
          <p>Version 1.0.0-beta</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'analyzer' && <ImageAnalyzer />}
      </main>
    </div>
  );
}

export default App;
