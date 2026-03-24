import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Save, X, Trash2, Edit2, Users, UserCheck, Shield } from 'lucide-react';

const EditorTeamPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { teams, players, teamOfficials, addTeamOfficial, updateTeamOfficial, deleteTeamOfficial, addPlayer, updatePlayer, deletePlayer } = useData();
  const [tab, setTab] = useState<'players' | 'officials'>('players');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', position: '', number: '' });
  const [offForm, setOffForm] = useState({ firstName: '', lastName: '', position: '' });
  const [showOffForm, setShowOffForm] = useState(false);
  const [editOffId, setEditOffId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const myTeam = teams.find(t => t.id === currentUser?.teamId);
  const myPlayers = players.filter(p => p.teamId === currentUser?.teamId);
  const myOfficials = (teamOfficials || []).filter(o => o.teamId === currentUser?.teamId);

  if (!currentUser || currentUser.role !== 'editor') {
    return <div className="min-h-screen bg-[#FAF9F6]"><Header/><div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-gray-400">Nuk keni akses.</p></div><Footer/></div>;
  }

  if (!myTeam) {
    return <div className="min-h-screen bg-[#FAF9F6]"><Header/><div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-gray-400">Nuk keni skuadrë të caktuar.</p></div><Footer/></div>;
  }

  const handleSavePlayer = () => {
    if (!form.firstName || !form.lastName) return;
    if (editId) {
      const existing = players.find(p => p.id === editId);
      if (existing) updatePlayer({ ...existing, firstName: form.firstName, lastName: form.lastName, position: form.position, number: form.number ? parseInt(form.number) : undefined } as any);
    } else {
      addPlayer({ firstName: form.firstName, lastName: form.lastName, teamId: myTeam.id, position: form.position, number: form.number ? parseInt(form.number) : undefined } as any);
    }
    setShowForm(false); setEditId(null); setForm({ firstName: '', lastName: '', position: '', number: '' });
  };

  const handleSaveOfficial = () => {
    if (!offForm.firstName || !offForm.lastName || !offForm.position) return;
    if (editOffId) {
      const existing = myOfficials.find(o => o.id === editOffId);
      if (existing) updateTeamOfficial({ ...existing, firstName: offForm.firstName, lastName: offForm.lastName, position: offForm.position });
    } else {
      addTeamOfficial({ teamId: myTeam.id, firstName: offForm.firstName, lastName: offForm.lastName, position: offForm.position });
    }
    setShowOffForm(false); setEditOffId(null); setOffForm({ firstName: '', lastName: '', position: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header/>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          {myTeam.logo && <img src={myTeam.logo} alt="" className="w-14 h-14 rounded-2xl object-cover border border-gray-200"/>}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{myTeam.name}</h1>
            <p className="text-sm text-gray-500">Menaxho lojtarët dhe zyrtaretë</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          <button onClick={() => setTab('players')} className={tab === 'players' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/>Lojtarët ({myPlayers.length})</span>
          </button>
          <button onClick={() => setTab('officials')} className={tab === 'officials' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4"/>Zyrtaretë ({myOfficials.length})</span>
          </button>
        </div>

        {tab === 'players' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditId(null); setForm({ firstName: '', lastName: '', position: '', number: '' }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC]"><Plus className="w-4 h-4"/>Shto Lojtar</button>
            </div>
            {showForm && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 shadow-sm space-y-3">
                <div className="flex justify-between"><h3 className="font-bold text-gray-800 text-sm">{editId ? 'Edito' : 'Lojtar i Ri'}</h3><button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400"/></button></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input value={form.firstName} onChange={e => setForm(p => ({...p, firstName: e.target.value}))} placeholder="Emri *" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                  <input value={form.lastName} onChange={e => setForm(p => ({...p, lastName: e.target.value}))} placeholder="Mbiemri *" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                  <input value={form.position} onChange={e => setForm(p => ({...p, position: e.target.value}))} placeholder="Pozita" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                  <input value={form.number} onChange={e => setForm(p => ({...p, number: e.target.value}))} placeholder="Nr." type="number" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                </div>
                <button onClick={handleSavePlayer} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium"><Save className="w-4 h-4"/>Ruaj</button>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {myPlayers.length === 0 ? <p className="p-6 text-gray-400 text-sm">Nuk ka lojtarë.</p> : myPlayers.map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 border-t border-gray-50 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {p.number && <span className="text-xs font-bold text-gray-400 w-6">#{p.number}</span>}
                    <div><p className="font-semibold text-gray-800 text-sm">{p.firstName} {p.lastName}</p>{p.position && <p className="text-xs text-gray-400">{p.position}</p>}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditId(p.id); setForm({ firstName: p.firstName, lastName: p.lastName, position: p.position || '', number: p.number?.toString() || '' }); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-[#1E6FF2] rounded-lg"><Edit2 className="w-3.5 h-3.5"/></button>
                    {deleteConfirm === p.id ? <button onClick={() => { deletePlayer(p.id); setDeleteConfirm(null); }} className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-lg font-bold">Po</button> : <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'officials' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditOffId(null); setOffForm({ firstName: '', lastName: '', position: '' }); setShowOffForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC]"><Plus className="w-4 h-4"/>Shto Zyrtar</button>
            </div>
            {showOffForm && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 shadow-sm space-y-3">
                <div className="flex justify-between"><h3 className="font-bold text-gray-800 text-sm">{editOffId ? 'Edito' : 'Zyrtar i Ri'}</h3><button onClick={() => setShowOffForm(false)}><X className="w-4 h-4 text-gray-400"/></button></div>
                <div className="grid grid-cols-3 gap-3">
                  <input value={offForm.firstName} onChange={e => setOffForm(p => ({...p, firstName: e.target.value}))} placeholder="Emri *" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                  <input value={offForm.lastName} onChange={e => setOffForm(p => ({...p, lastName: e.target.value}))} placeholder="Mbiemri *" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                  <input value={offForm.position} onChange={e => setOffForm(p => ({...p, position: e.target.value}))} placeholder="Pozita *" className="px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
                </div>
                <button onClick={handleSaveOfficial} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium"><Save className="w-4 h-4"/>Ruaj</button>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {myOfficials.length === 0 ? <p className="p-6 text-gray-400 text-sm">Nuk ka zyrtarë.</p> : myOfficials.map(o => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3 border-t border-gray-50 hover:bg-gray-50">
                  <div><p className="font-semibold text-gray-800 text-sm">{o.firstName} {o.lastName}</p><p className="text-xs text-gray-400">{o.position}</p></div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditOffId(o.id); setOffForm({ firstName: o.firstName, lastName: o.lastName, position: o.position }); setShowOffForm(true); }} className="p-1.5 text-gray-400 hover:text-[#1E6FF2] rounded-lg"><Edit2 className="w-3.5 h-3.5"/></button>
                    {deleteConfirm === o.id ? <button onClick={() => { deleteTeamOfficial(o.id); setDeleteConfirm(null); }} className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-lg font-bold">Po</button> : <button onClick={() => setDeleteConfirm(o.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default EditorTeamPage;