import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Trash2, ChevronLeft, AlertTriangle, FileText } from 'lucide-react';

const AdminTeamStats: React.FC = () => {
  const { teams, players, competitions, playerDiscipline, addPlayerDiscipline, deletePlayerDiscipline, getActiveSeason } = useData();
  const [selectedComp, setSelectedComp] = useState<'superliga' | 'liga_pare'>('superliga');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [form, setForm] = useState({ week: 1, type: 'yellow' as 'yellow' | 'red' | 'note', note: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const season = getActiveSeason();
  const filteredTeams = teams.filter(t => {
    const c = competitions.find(cc => cc.id === t.competitionId);
    return c?.type === selectedComp;
  });

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const teamPlayers = players.filter(p => p.teamId === selectedTeamId);
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const playerRecords = (playerDiscipline || []).filter(d => d.playerId === selectedPlayerId);

  const handleAdd = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    addPlayerDiscipline({
      playerId: selectedPlayerId,
      teamId: selectedTeamId,
      week: form.week,
      type: form.type,
      note: form.type === 'note' ? form.note : undefined,
      seasonId: season?.id,
    });
    setForm(p => ({ ...p, note: '' }));
  };

  if (selectedPlayerId && selectedPlayer) {
    return (
      <div>
        <button onClick={() => setSelectedPlayerId(null)} className="flex items-center gap-1 text-sm text-[#1E6FF2] mb-4 hover:underline"><ChevronLeft className="w-4 h-4"/>Kthehu te lojtarët</button>
        <div className="flex items-center gap-3 mb-6">
          {selectedPlayer.photo && <img src={selectedPlayer.photo} alt="" className="w-12 h-12 rounded-full object-cover"/>}
          <div>
            <h2 className="text-lg font-bold text-gray-800">{selectedPlayer.firstName} {selectedPlayer.lastName}</h2>
            <p className="text-sm text-gray-500">{selectedTeam?.name} - #{selectedPlayer.number}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 text-sm">Shto Ndëshkim / Shënim</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Java</label>
              <input type="number" min="1" value={form.week} onChange={e => setForm(p => ({ ...p, week: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"/>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Lloji</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="yellow">Karton i Verdhë</option>
                <option value="red">Karton i Kuq</option>
                <option value="note">Shënim Shtesë</option>
              </select>
            </div>
            {form.type === 'note' && (
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Shënimi</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Shënimi..."/>
              </div>
            )}
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC]"><Plus className="w-4 h-4"/>Shto</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase grid grid-cols-[60px_1fr_1fr_50px]">
            <span>Java</span><span>Lloji</span><span>Shënimi</span><span></span>
          </div>
          {playerRecords.length === 0 ? <p className="p-5 text-gray-400 text-sm">Nuk ka regjistrime.</p> : playerRecords.sort((a,b) => a.week - b.week).map(d => (
            <div key={d.id} className="grid grid-cols-[60px_1fr_1fr_50px] px-5 py-3 border-t border-gray-50 items-center hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{d.week}</span>
              <span className="flex items-center gap-1.5">
                {d.type === 'yellow' && <span className="w-4 h-5 bg-yellow-400 rounded-sm inline-block"/>}
                {d.type === 'red' && <span className="w-4 h-5 bg-red-500 rounded-sm inline-block"/>}
                {d.type === 'note' && <FileText className="w-4 h-4 text-blue-500"/>}
                <span className="text-sm text-gray-700">{d.type === 'yellow' ? 'Karton i Verdhë' : d.type === 'red' ? 'Karton i Kuq' : 'Shënim'}</span>
              </span>
              <span className="text-sm text-gray-500">{d.note || '-'}</span>
              <div>
                {deleteConfirm === d.id ? (
                  <button onClick={() => { deletePlayerDiscipline(d.id); setDeleteConfirm(null); }} className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-lg font-bold">Po</button>
                ) : (
                  <button onClick={() => setDeleteConfirm(d.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedTeamId && selectedTeam) {
    return (
      <div>
        <button onClick={() => setSelectedTeamId(null)} className="flex items-center gap-1 text-sm text-[#1E6FF2] mb-4 hover:underline"><ChevronLeft className="w-4 h-4"/>Kthehu te skuadrat</button>
        <div className="flex items-center gap-3 mb-6">
          {selectedTeam.logo && <img src={selectedTeam.logo} alt="" className="w-12 h-12 rounded-xl object-cover"/>}
          <h2 className="text-lg font-bold text-gray-800">{selectedTeam.name} - Lojtarët</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {teamPlayers.length === 0 ? <p className="p-5 text-gray-400 text-sm">Nuk ka lojtarë.</p> : teamPlayers.map(p => {
            const yellows = (playerDiscipline || []).filter(d => d.playerId === p.id && d.type === 'yellow').length;
            const reds = (playerDiscipline || []).filter(d => d.playerId === p.id && d.type === 'red').length;
            const notes = (playerDiscipline || []).filter(d => d.playerId === p.id && d.type === 'note').length;
            return (
              <div key={p.id} onClick={() => setSelectedPlayerId(p.id)} className="flex items-center justify-between px-5 py-3 border-t border-gray-50 hover:bg-blue-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  {p.photo ? <img src={p.photo} alt="" className="w-9 h-9 rounded-full object-cover"/> : <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>}
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-gray-400">{p.position || ''} {p.number ? '#' + p.number : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {yellows > 0 && <span className="flex items-center gap-0.5 text-xs"><span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block"/>{yellows}</span>}
                  {reds > 0 && <span className="flex items-center gap-0.5 text-xs"><span className="w-3 h-4 bg-red-500 rounded-sm inline-block"/>{reds}</span>}
                  {notes > 0 && <span className="flex items-center gap-0.5 text-xs text-blue-500"><FileText className="w-3 h-3"/>{notes}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Skuadrat & Lojtarët Stat.</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kartona dhe shënime për lojtarët</p>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setSelectedComp('superliga')} className={selectedComp === 'superliga' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>Superliga</button>
        <button onClick={() => setSelectedComp('liga_pare')} className={selectedComp === 'liga_pare' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>Liga e Parë</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTeams.map(t => (
          <div key={t.id} onClick={() => setSelectedTeamId(t.id)} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 text-center">
            {t.logo ? <img src={t.logo} alt="" className="w-14 h-14 rounded-xl object-cover mx-auto mb-2"/> : <div className="w-14 h-14 rounded-xl bg-gray-100 mx-auto mb-2 flex items-center justify-center text-lg font-bold text-gray-300">{t.name.charAt(0)}</div>}
            <p className="text-sm font-bold text-gray-800">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamStats;