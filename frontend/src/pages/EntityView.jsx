import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Download, RefreshCw, Plus, Edit2, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import api from '../api';

export default function EntityView() {
  const { sheetName } = useParams();
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/inventory/${encodeURIComponent(sheetName)}`);
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur Backend. Assurez-vous qu'il est en cours d'exécution sur le port 3001.");
    } finally {
      setLoading(false);
    }
  }, [sheetName]);

  useEffect(() => {
    fetchData();
    setEditingId(null);
    setIsAdding(false);
  }, [fetchData]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data.rows, { header: data.headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    XLSX.writeFile(wb, `Export_${sheetName}.xlsx`);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditForm({ ...row });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleEditChange = (key, value) => {
    setEditForm(prev => ({ ...prev, [key]: value }));
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/inventory/${encodeURIComponent(sheetName)}/${id}`, editForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde côté serveur.");
    }
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({});
  };

  const saveAdd = async () => {
    try {
      await api.post(`/inventory/${encodeURIComponent(sheetName)}`, editForm);
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout.");
    }
  };

  const deleteRow = async (id) => {
    if(!window.confirm('Etes-vous sûr de vouloir supprimer cette ligne définitivement ?')) return;
    try {
      await api.delete(`/inventory/${encodeURIComponent(sheetName)}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erreur de suppression.");
    }
  };

  const isBatteryLow = (batteryVal) => {
    if (!batteryVal) return false;
    const num = parseFloat(batteryVal.toString().replace('%', ''));
    return !isNaN(num) && num < 60;
  };

  if (loading) return <div className="animate-fade-in" style={{display:'flex',gap:'1rem',alignItems:'center',color:'var(--text-secondary)'}}><RefreshCw className="animate-spin" /> Lecture de l&apos;Excel en cours...</div>;
  
  if (error) return (
    <div className="glass-panel" style={{padding: '2rem', color: 'var(--danger)', display:'flex', gap:'1rem', alignItems:'center'}}>
      <AlertTriangle size={24} /> {error}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>{sheetName}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Outil de Gestion CRUD — {data.rows.length} enregistrements</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={18} /> Exporter XLSX
          </button>
          <button className="btn" style={{ background: 'var(--success)', color: 'white' }} onClick={startAdd}>
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </header>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ flex: 1, margin: 0, borderRadius: '16px', overflowY: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                {data.headers.map(h => {
                  const isTotal = h.toLowerCase().includes('total') || h.toLowerCase().includes('totale');
                  return (
                    <th key={h} style={isTotal ? { color: '#fbbf24', fontWeight: 'bold', fontSize: '1rem' } : {}}>
                      {isTotal ? 'TOTALE' : h}
                    </th>
                  );
                })}
                <th style={{ width: '130px', textAlign: 'center', position: 'sticky', right: 0, background: 'rgba(15,23,42,0.9)', zIndex: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  {data.headers.map(h => (
                    <td key={`add-${h}`}>
                      <input 
                        className="input-glass"
                        style={{ padding: '0.4rem', fontSize: '0.9rem', width: '100%', minWidth: '100px' }}
                        placeholder={`Saisir ${h}`}
                        value={editForm[h] || ''} 
                        onChange={(e) => handleEditChange(h, e.target.value)}
                      />
                    </td>
                  ))}
                  <td style={{ position: 'sticky', right: 0, background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button className="btn" style={{ padding: '0.4rem', background: 'var(--success)', color: 'white' }} onClick={saveAdd}><Save size={16} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={cancelEdit}><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {data.rows.map(row => {
                const isEditing = editingId === row.id;
                const isTotalRow = Object.values(row).some(v => v && typeof v === 'string' && (v.toLowerCase().includes('total') || v.toLowerCase().includes('totale')));

                return (
                  <tr key={row.id} style={isTotalRow ? { backgroundColor: 'rgba(251, 191, 36, 0.15)', borderTop: '2px solid #fbbf24', borderBottom: '2px solid #fbbf24' } : {}}>
                    {data.headers.map(h => {
                       const val = row[h];
                       const showWarning = h.toLowerCase().includes('batterie') && isBatteryLow(val);
                       const isTotal = h.toLowerCase().includes('total') || h.toLowerCase().includes('totale');
                       
                       return (
                        <td key={`${row.id}-${h}`} style={isTotal ? { color: '#fbbf24', fontWeight: 'bold', background: 'rgba(251, 191, 36, 0.05)' } : {}}>
                          {isEditing ? (
                            <input 
                              className="input-glass"
                              value={editForm[h] || ''} 
                              onChange={(e) => handleEditChange(h, e.target.value)}
                              style={{ padding: '0.4rem', fontSize: '0.9rem', width: '100%', minWidth: '100px' }}
                            />
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: showWarning ? 'var(--warning)' : 'inherit' }}>
                               {showWarning && <AlertTriangle size={14} />}
                               {val || '-'}
                            </span>
                          )}
                        </td>
                       )
                    })}
                    <td style={{ position: 'sticky', right: 0, background: 'rgba(15,23,42,0.9)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {isEditing ? (
                          <>
                            <button className="btn" style={{ padding: '0.4rem', background: 'var(--success)', color: 'white' }} onClick={() => saveEdit(row.id)}><Save size={16} /></button>
                            <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={cancelEdit}><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button className="btn" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => startEdit(row)}><Edit2 size={16} /></button>
                            <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => deleteRow(row.id)}><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {data.rows.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={data.headers.length + 1} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Aucune donnée trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Les modifications sont sauvegardées directement dans l&apos;Excel source.</span>
          <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'transparent', color: 'var(--accent)' }} onClick={fetchData}>
             <RefreshCw size={16} /> Rafraîchir
          </button>
        </div>
      </div>
    </div>
  );
}
