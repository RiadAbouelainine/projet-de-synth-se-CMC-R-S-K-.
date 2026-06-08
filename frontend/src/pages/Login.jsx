import { GoogleLogin } from '@react-oauth/google';
import { ShieldAlert, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';

export default function Login({ onLogin }) {
  const [error, setError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const adminEmailToReceiveSupport = "admin@tribologie.com"; // Email qui reçoit les demandes

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        role: 'user'
      };
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch {
      setError("Échec de connexion Google.");
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Identifiants Super Admin en dur (Demande du client)
    if (adminUser === 'admin@tribologie.com' && adminPass === 'admin123') {
      const user = { name: 'Super Admin', email: adminUser, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError("Identifiants Admin incorrects.");
    }
  };

  // Workflow "Demande d'accès"
  const handleRequestAccess = () => {
    const subject = encodeURIComponent("Demande d'accès - Gestion Ressources");
    const body = encodeURIComponent("Bonjour,\n\nJe souhaite demander un accès pour l'application de Gestion des Ressources afin de pouvoir consulter l'inventaire.\n\nCordialement,");
    window.location.href = `mailto:${adminEmailToReceiveSupport}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Gestion Ressources</h1>
        
        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        {!showAdminLogin ? (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Connectez-vous avec Google ou demandez un accès administrateur.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Échec de l'authentification Google.")}
                theme="filled_black"
                shape="rectangular"
                size="large"
              />
            </div>

            <button className="btn" onClick={handleRequestAccess} style={{ width: '100%', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
              <Mail size={18} /> Demande d'accès (Email)
            </button>

            <button className="btn" onClick={() => setShowAdminLogin(true)} style={{ width: '100%', background: 'transparent', color: 'var(--text-secondary)' }}>
              <Lock size={18} /> Accès Super Admin
            </button>
          </>
        ) : (
          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Portail Super Admin</p>
            
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
               <User size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
               <input 
                 type="email" 
                 placeholder="Email admin" 
                 value={adminUser}
                 onChange={e => setAdminUser(e.target.value)}
                 style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                 required
               />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
               <Lock size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
               <input 
                 type="password" 
                 placeholder="Mot de passe" 
                 value={adminPass}
                 onChange={e => setAdminPass(e.target.value)}
                 style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                 required
               />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Se connecter
            </button>

            <button type="button" className="btn" onClick={() => setShowAdminLogin(false)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
              Retour au login par défaut
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
