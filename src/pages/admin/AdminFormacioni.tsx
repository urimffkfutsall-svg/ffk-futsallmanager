import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { WeeklyFormation, FormationPlayer, FormationCoach } from '@/types';
import { Plus, Save, X, Trash2, Shield } from 'lucide-react';

const emptyPlayer = (position: 'goalkeeper' | 'field', positionIndex: number): Omit<FormationPlayer, 'id'> => ({
  firstName: '', lastName: '', teamId: '', position, positionIndex
});

const AdminFormacioni: React.FC = () => {
  const { teams, weeklyFormations, addWeeklyFormation, updateWeeklyFormation, deleteWeeklyFormation, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();
  const allTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);

  const [editing, setEditing] = useState<WeeklyFormation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [week, setWeek] = useState(1);
  const [goalkeeper, setGoalkeeper] = useState({ firstName: '', lastName: '', teamId: '' });
  const [fieldPlayers, setFieldPlayers] = useState([
    { firstName: '', lastName: '', teamId: '', positionIndex: 0 },
    { firstName: '', lastName: '', teamId: '', positionIndex: 1 },
    { firstName: '', lastName: '', teamId: '', positionIndex: 2 },
    { firstName: '', lastName: '', teamId: '', positionIndex: 3 },
  ]);
  const [coach, setCoach] = useState({ firstName: '', lastName: '', teamId: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sorted = [...(weeklyFormations || [])].sort((a, b) => b.week - a.week);

  const openNew = () => {
    setEditing(null);
    setWeek(1);
    setGoalkeeper({ firstName: '', lastName: '', teamId: '' });
    setFieldPlayers([
      { firstName: '', lastName: '', teamId: '', positionIndex: 0 },
      { firstName: '', lastName: '', teamId: '', positionIndex: 1 },
      { firstName: '', lastName: '', teamId: '', positionIndex: 2 },
      { firstName: '', lastName: '', teamId: '', positionIndex: 3 },
    ]);
    setCoach({ firstName: '', lastName: '', teamId: '' });
    setShowForm(true);
  };

  const openEdit = (f: WeeklyFormation) => {
    setEditing(f);
    setWeek(f.week);
    const gk = f.players.find(p => p.position === 'goalkeeper');
    setGoalkeeper({ firstName: gk?.firstName || '', lastName: gk?.lastName || '', teamId: gk?.teamId || '' });
    const fp = f.players.filter(p => p.position === 'field').sort((a, b) => a.positionIndex - b.positionIndex);
    setFieldPlayers([0,1,2,3].map(i => ({
      firstName: fp[i]?.firstName || '', lastName: fp[i]?.lastName || '',
      teamId: fp[i]?.teamId || '', positionIndex: i
    })));
    setCoach({ firstName: f.coach?.firstName || '', lastName: f.coach?.lastName || '', teamId: f.coach?.teamId || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    const genId = () => crypto.randomUUID();
    const players: FormationPlayer[] = [];
    if (goalkeeper.firstName) players.push({ id: genId(), ...goalkeeper, position: 'goalkeeper', positionIndex: 0 });
    fieldPlayers.forEach(fp => {
      if (fp.firstName) players.push({ id: genId(), ...fp, position: 'field' });
    });
    const coachData: FormationCoach | undefined = coach.firstName ? coach : undefined;

    if (editing) {
      updateWeeklyFormation({ ...editing, week, players, coach: coachData });
    } else {
      addWeeklyFormation({ week, players, coach: coachData, seasonId: activeSeason?.id });
    }
    setShowForm(false);
  };

  const updateField = (i: number, field: string, val: string) => {
    setFieldPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  };

  const renderPlayer = (label: string, val: {firstName:string;lastName:string;teamId:string}, onChange: (f:string,v:string)=>void) =>
    (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-500 uppercase mb-3">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={val.firstName} onChange={e => onChange('firstName', e.target.value)}
          placeholder="Emri" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30"/>
        <input value={val.lastName} onChange={e => onChange('lastName', e.target.value)}
          placeholder="Mbiemri" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30"/>
        <select value={val.teamId} onChange={e => onChange('teamId', e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30 bg-white">
          <option value="">Skuadra...</option>
          {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Formacioni i Javës</h2>
          <p className="text-sm text-gray-500 mt-0.5">Shto formacionin e javës me 1 portier dhe 4 lojtarë</p>
        </div>
        {!showForm && (
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors">
            <Plus className="w-4 h-4"/>Shto Formacion
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">{editing ? 'Edito Formacionin' : 'Formacion i Ri'}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Java *</label>
            <input type="number" min={1} value={week} onChange={e => setWeek(parseInt(e.target.value)||1)}
              className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E6FF2]/30"/>
          </div>

          <div>
            <p className="text-sm font-bold text-[#1E6FF2] mb-3 flex items-center gap-2"><Shield className="w-4 h-4"/>Portieri</p>
            {renderPlayer("Portieri", goalkeeper, (f,v) => setGoalkeeper(prev => ({...prev,[f]:v})))}
          </div>

          <div>
            <p className="text-sm font-bold text-[#1E6FF2] mb-3">Lojtarët e Fushës (4)</p>
            <div className="space-y-3">
              {fieldPlayers.map((fp, i) => (
                renderPlayer(`Lojtari ${i+1}`, fp, (f,v) => updateField(i,f,v))
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-600 mb-3">Trajneri i Javës (opsional)</p>
            {renderPlayer("Trajneri", coach, (f,v) => setCoach(prev => ({...prev,[f]:v})))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC] transition-colors">
              <Save className="w-4 h-4"/>Ruaj
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4"/>Anulo
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Shield className="w-10 h-10 text-gray-200 mx-auto mb-3"/>
          <p className="text-gray-400">Nuk ka formacione të shtuara ende.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(f => (
            <div key={f.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-4">
              <div>
                <span className="bg-[#1E6FF2] text-white text-xs font-bold px-3 py-1 rounded-full">Java {f.week}</span>
                <p className="text-sm text-gray-600 mt-2">{f.players.length} lojtarë{f.coach ? ` • Trajner: ${f.coach.firstName} ${f.coach.lastName}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(f)} className="p-2 text-gray-400 hover:text-[#1E6FF2] hover:bg-blue-50 rounded-lg transition-colors">
                  <Save className="w-4 h-4"/>
                </button>
                {deleteConfirm === f.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => { deleteWeeklyFormation(f.id); setDeleteConfirm(null); }} className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg font-medium">Konfirmo</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Jo</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(f.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminFormacioni;
