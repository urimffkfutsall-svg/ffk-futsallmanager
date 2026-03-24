import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { User } from '@/types';
import { Plus, Save, X, Trash2, Edit2, Shield, UserCheck, Check, XCircle, Ban, Phone, Mail } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, teams, competitions } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', password: '', phone: '', email: '', teamId: '', role: 'editor' as 'admin' | 'editor' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const editors = (users || []).filter(u => u.role === 'editor');
  const pendingEditors = editors.filter(u => u.status === 'pending');
  const activeEditors = editors.filter(u => u.status === 'approved' || !u.status);
  const otherEditors = editors.filter(u => u.status === 'rejected' || u.status === 'deactive');

  const getTeamName = (id?: string) => { const t = teams.find(x => x.id === id); return t?.name || '-'; };

  const openEdit = (u: User) => {
    setEditId(u.id);
    setForm({ firstName: u.firstName || '', lastName: u.lastName || '', username: u.username, password: '', phone: u.phone || '', email: u.email || '', teamId: u.teamId || '', role: u.role });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.username) return;
    if (editId) {
      const existing = users.find(u => u.id === editId);
      if (existing) {
        updateUser({ ...existing, firstName: form.firstName, lastName: form.lastName, username: form.username, password: form.password || existing.password, phone: form.phone, email: form.email, teamId: form.teamId, role: form.role });
      }
    }
    setShowForm(false);
    setEditId(null);
  };

  const approve = (u: User) => updateUser({ ...u, status: 'approved' });
  const reject = (u: User) => updateUser({ ...u, status: 'rejected' });
  const deactivate = (u: User) => updateUser({ ...u, status: 'deactive' });
  const activate = (u: User) => updateUser({ ...u, status: 'approved' });

  const superligaTeams = teams.filter(t => { const c = competitions.find(cc => cc.id === t.competitionId); return c?.type === 'superliga'; });
  const ligaTeams = teams.filter(t => { const c = competitions.find(cc => cc.id === t.competitionId); return c?.type === 'liga_pare'; });

  const EditorRow: React.FC<{u: User}> = ({u}) => (
    <div className="flex items-center justify-between p-4 border-t border-gray-50 hover:bg-gray-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#0A1E3C] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">{(u.firstName || u.username).charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-gray-400">@{u.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500 hidden sm:block">{getTeamName(u.teamId)}</span>
        {u.phone && <span className="text-xs text-gray-400 hidden md:flex items-center gap-1"><Phone className="w-3 h-3"/>{u.phone}</span>}
        {u.status === 'pending' && (
          <div className="flex items-center gap-1">
            <button onClick={() => approve(u)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Aprovo"><Check className="w-4 h-4"/></button>
            <button onClick={() => reject(u)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="Refuzo"><XCircle className="w-4 h-4"/></button>
          </div>
        )}
        {(u.status === 'approved' || !u.status) && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Aktiv</span>
        )}
        {u.status === 'deactive' && <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Joaktiv</span>}
        {u.status === 'rejected' && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Refuzuar</span>}
        <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-[#1E6FF2] hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5"/></button>
        {(u.status === 'approved' || !u.status) && <button onClick={() => deactivate(u)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg" title="Deaktivizo"><Ban className="w-3.5 h-3.5"/></button>}
        {(u.status === 'deactive' || u.status === 'rejected') && <button onClick={() => activate(u)} className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg" title="Aktivizo"><Check className="w-3.5 h-3.5"/></button>}
        {deleteConfirm === u.id ? (
          <button onClick={() => { deleteUser(u.id); setDeleteConfirm(null); }} className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-lg font-bold">Fshij?</button>
        ) : (
          <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Editorët</h2>
          <p className="text-sm text-gray-500 mt-0.5">Menaxho editorët e panelit</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Edito Editorin</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-xs text-gray-600 mb-1">Emri</label><input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Mbiemri</label><input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Username *</label><input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Fjalëkalimi (bosh = pa ndryshim)</label><input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Telefoni</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div><label className="block text-xs text-gray-600 mb-1">Email</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/></div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Skuadra</label>
              <select value={form.teamId} onChange={e => setForm(p => ({ ...p, teamId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="">Pa skuadrë</option>
                {superligaTeams.map(t => <option key={t.id} value={t.id}>{t.name} (SL)</option>)}
                {ligaTeams.map(t => <option key={t.id} value={t.id}>{t.name} (LP)</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC]"><Save className="w-4 h-4"/>Ruaj</button>
          </div>
        </div>
      )}

      {/* Pending */}
      {pendingEditors.length > 0 && (
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-3 bg-yellow-100 text-sm font-bold text-yellow-800">Në Pritje ({pendingEditors.length})</div>
          {pendingEditors.map(u => <EditorRow key={u.id} u={u}/>)}
        </div>
      )}

      {/* Active */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-3 bg-gray-50 text-sm font-bold text-gray-600">Aktivë ({activeEditors.length})</div>
        {activeEditors.length === 0 ? <p className="p-6 text-gray-400 text-sm">Nuk ka editorë aktivë.</p> : activeEditors.map(u => <EditorRow key={u.id} u={u}/>)}
      </div>

      {/* Inactive/Rejected */}
      {otherEditors.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 text-sm font-bold text-gray-600">Joaktivë / Refuzuar ({otherEditors.length})</div>
          {otherEditors.map(u => <EditorRow key={u.id} u={u}/>)}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;