import { Camera, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';


const mockData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 132 },
  { name: 'Wed', value: 101 },
  { name: 'Thu', value: 145 },
  { name: 'Fri', value: 155 },
  { name: 'Sat', value: 150 },
  { name: 'Sun', value: 165 },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div style={{ paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Central dashboard for retro-reflectivity assessments.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>84<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>%</span></h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Compliance Rate</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>142<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}> mcd/m²</span></h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Reflectivity</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>12</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Critical Degradations</p>
          </div>
        </div>
      </div>

      {/* Start Analyzer Call to Action */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Process New Data?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Upload your night-time flash photographs of road markings or signage to instantly calculate a retro-reflectivity index.
        </p>
        <button className="btn-primary flex-center" style={{ gap: '8px', margin: '0 auto' }} onClick={() => onNavigate('analyzer')}>
          <Camera size={20} />
          Launch Image Analyzer
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Performance Trend</h3>
        <div style={{ height: '300px', width: '100%' }}>
          {/* Note: I haven't installed Recharts yet, so I'll render a placeholder if recharts isn't used, but let's assume I will install it.
              Actually, I haven't installed recharts. Let's just create a nice CSS-based placeholder to avoid npm install and build breaks if I don't use it.
              I will change this to a simple placeholder graphic instead of recharts to keep dependencies low. */}
          <div style={{ height: '100%', width: '100%', background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%)', border: '1px dashed var(--panel-border)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '10px' }}>
            {mockData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${(d.value / 200) * 100}%`, 
                  background: 'var(--accent-teal)', 
                  borderRadius: '4px 4px 0 0',
                  minHeight: '20px'
                }}></div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
