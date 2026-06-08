import { Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import { Monitor, Users, Briefcase, Printer, DollarSign, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EntityView from './pages/EntityView'

function readStoredUser() {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(readStoredUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tribologie', path: '/entity/Tribologie', icon: Briefcase },
    { name: 'Production Increase', path: '/entity/Production Increase', icon: Monitor },
    { name: 'A TRANSIT', path: '/entity/A TRANSIT', icon: Users },
    { name: 'Stagiaires', path: '/entity/Stagiaires', icon: Users },
    { name: 'Moyenne généraux', path: '/entity/Moyenne généraux', icon: Printer },
    { name: 'Prix', path: '/entity/Prix', icon: DollarSign },
    { name: 'Employés', path: '/entity/EMPLOYES PAR BUREAU', icon: Users },
  ];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 className="text-gradient">Gestion Ressources</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {user?.name || "Utilisateur"} {user?.role === 'admin' && "(Admin)"}
          </p>
        </div>
        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`nav-item ${location.pathname === link.path || location.pathname === encodeURI(link.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            )
          })}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <ShieldCheck size={20} />
              Admin Access
            </Link>
          )}
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entity/:sheetName" element={<EntityView />} />
          <Route path="/admin" element={<div className="glass-panel" style={{padding:'2rem'}}><h2>Admin Panel</h2><p>Gestion des demandes d&apos;accès (En développement)</p></div>} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
