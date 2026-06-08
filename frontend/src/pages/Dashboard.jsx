import { Link } from 'react-router-dom';
import { Briefcase, Monitor, Users, Printer, DollarSign } from 'lucide-react';

const cards = [
  { name: 'Tribologie', path: '/entity/Tribologie', icon: Briefcase, color: '#3b82f6', desc: 'Gestion du matériel Tribologie (5ème étage)' },
  { name: 'Production Increase', path: '/entity/Production Increase', icon: Monitor, color: '#10b981', desc: 'Inventaire Production Increase (5ème étage)' },
  { name: 'A TRANSIT', path: '/entity/A TRANSIT', icon: Users, color: '#f59e0b', desc: 'Ressources A TRANSIT (4ème étage)' },
  { name: 'Stagiaires', path: '/entity/Stagiaires', icon: Users, color: '#8b5cf6', desc: 'Suivi matériel pour les stagiaires' },
  { name: 'Moyenne généraux', path: '/entity/Moyenne généraux', icon: Printer, color: '#ec4899', desc: 'Imprimantes, machines à café, mobilier et réseaux' },
  { name: 'Employés par bureau', path: '/entity/EMPLOYES PAR BUREAU', icon: Users, color: '#14b8a6', desc: 'Récapitulatif et allocation des effectifs' },
  { name: 'Prix', path: '/entity/Prix', icon: DollarSign, color: '#ef4444', desc: 'Table de référence des coûts informatiques/ameublement' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Tableau de Bord</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sélectionnez un département ou une entité pour gérer son inventaire.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const getCompanyLogo = (name) => {
             if (name === 'Tribologie') return '/logos/tribologie.svg';
             return null;
          };

          return (
             <Link key={card.name} to={card.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={`glass-card animate-delay-${(idx % 3) + 1}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ background: `${card.color}20`, borderRadius: '12px', color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', overflow: 'hidden' }}>
                      {getCompanyLogo(card.name) ? (
                        <img src={getCompanyLogo(card.name)} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Icon size={28} />
                      )}
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{card.name}</h2>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{card.desc}</p>
                </div>
             </Link>
          )
        })}
      </div>
    </div>
  );
}
