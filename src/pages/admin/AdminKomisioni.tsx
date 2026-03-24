import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { CommissionDecision } from '@/types';
import { Plus, Pencil, Trash2, Save, X, FileText } from 'lucide-react';

const AdminKomisioni: React.FC = () => {
  const { commissionDecisions, addCommissionDecision, updateCommissionDecision, deleteCommissionDecision } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', week: 1, date: '', showOnLanding: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sorted = [...commissionDecisions].sort((a, b) => b.week - a.week);

  const resetForm = () => {
    setForm({ title: '', content: '', week: 1, date: '', showOnLanding: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (d: CommissionDecision) => {
    setForm({ title: d.title, content: d.content, week: d.week, date: d.date || '', showOnLanding: d.showOnLanding || false });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      const existing = commissionDecisions.find(d => d.id === editingId);
      if (existing) updateCommissionDecision({ ...existing, ...form });
    } else {
      addCommissionDecision(form);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteCommissionDecision(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Vendimet e Komisionit</h2>
          <p className="text-sm text-gray-500 mt-0.5">Shto, edito ose fshi vendimet që shfaqen në faqen Komisioni</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors">
            <Plus className="w-4 h-4" />
            Shto Vendim
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">{editingId ? 'Edito Vendimin' : 'Vendim i Ri'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Java *</label>
              <input type="number" min={1} value={form.week} onChange={e => setForm(f => ({ ...f, week: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data (opsionale)</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titulli *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30" placeholder="p.sh. Vendim për lojtar të pezulluar" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Përmbajtja *</label>
            <textarea rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30 resize-none" placeholder="Shkruaj tekstin e vendimit..." />
          </div>
                      <div className="flex items-center gap-2 mt-4 mb-4">
              <input type="checkbox" id="showOnLanding" checked={form.showOnLanding} onChange={e => setForm(f => ({ ...f, showOnLanding: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-[#1E6FF2] focus:ring-[#1E6FF2]"/>
              <label htmlFor="showOnLanding" className="text-sm font-medium text-gray-700">Shfaq n ë landing page</label>
            </div>
                        <div className="flex items-center gap-2 mt-4 mb-4">
              <input type="checkbox" id="showOnLanding" checked={form.showOnLanding} onChange={e => setForm(f => ({ ...f, showOnLanding: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-[#1E6FF2] focus:ring-[#1E6FF2]"/>
              <label htmlFor="showOnLanding" className="text-sm font-medium text-gray-700">Shfaq n ë landing page</label>
            </div>
            <div className="flex gap-3">
            <button onClick={handleSave} disabled={!form.title.trim() || !form.content.trim()} className="flex items-center gap-2 px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />Ruaj
            </button>
            <button onClick={resetForm} className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />Anulo
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Nuk ka vendime të shtuara ende.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-[#1E6FF2] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Java {d.week}</span>
                    {d.date && <span className="text-xs text-gray-400">{d.date}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{d.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">{d.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(d)} className="p-2 text-gray-400 hover:text-[#1E6FF2] hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === d.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(d.id)} className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 font-medium">Konfirmo</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">Jo</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(d.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminKomisioni;
