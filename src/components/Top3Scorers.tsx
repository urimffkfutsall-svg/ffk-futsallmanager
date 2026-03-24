import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Target, X, User, Trophy } from 'lucide-react';
import { Scorer } from '@/types';

const Top3Scorers: React.FC = () => {
  const { getAggregatedScorers, getTeamById } = useData();
  const scorers = getAggregatedScorers().slice(0, 3);
  const [selected, setSelected] = useState<Scorer | null>(null);

  if (scorers.length === 0) return null;

  const medals = ['from-yellow-400 to-amber-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-orange-600'];
  const shadows = ['shadow-yellow-200/50', 'shadow-gray-200/50', 'shadow-orange-200/50'];
  const nums = ['1', '2', '3'];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
        <h2 className="text-xl font-black text-[#0A1E3C]">Top Golashënues</h2>
      </div>

      <div className="flex flex-col gap-3">
        {scorers.map((s, i) => {
          const team = getTeamById(s.teamId);
          const styleObj = { transform: 'perspective(800px) rotateY(0deg)', transformStyle: 'preserve-3d' as const };
          return (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${shadows[i]} shadow-lg`}
              style={styleObj}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'perspective(800px) rotateY(-3deg) rotateX(2deg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'; }}
            >
              <div className={`h-1.5 bg-gradient-to-r ${medals[i]}`}/>
              <div className="bg-white p-4 flex items-center gap-3">
                <div className="text-lg font-black text-[#0A1E3C] w-6 text-center flex-shrink-0">{nums[i]}</div>
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-100 shadow-inner">
                  {s.photo
                    ? <img src={s.photo} alt={s.firstName} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0A1E3C] truncate">{s.firstName} {s.lastName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {team?.logo && <img src={team.logo} alt="" className="w-4 h-4 rounded-full"/>}
                    <span className="text-xs text-gray-500 truncate">{team?.name}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 bg-gradient-to-r ${medals[i]} text-white px-3 py-1.5 rounded-xl shadow-md`}>
                  <Target className="w-3.5 h-3.5"/>
                  <span className="font-black text-sm">{s.goals}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] p-6 text-center relative">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-white/60 hover:text-white">
                <X className="w-5 h-5"/>
              </button>
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-3 border-white/30 shadow-xl mb-3">
                {selected.photo
                  ? <img src={selected.photo} alt="" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full bg-white/10 flex items-center justify-center text-3xl font-black text-white/30">{selected.firstName.charAt(0)}{selected.lastName.charAt(0)}</div>}
              </div>
              <h3 className="text-xl font-black text-white">{selected.firstName} {selected.lastName}</h3>
              {(() => { const team = getTeamById(selected.teamId); return team ? (
                <div className="flex items-center justify-center gap-2 mt-2">
                  {team.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-full border border-white/30"/>}
                  <span className="text-blue-200 text-sm font-semibold">{team.name}</span>
                </div>
              ) : null; })()}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500"/>
                    <span className="text-sm font-semibold text-gray-700">Gola totale</span>
                  </div>
                  <span className="text-2xl font-black text-[#1E6FF2]">{selected.goals}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500"/>
                    <span className="text-sm font-semibold text-gray-700">Skuadra</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{(() => { const t = getTeamById(selected.teamId); return t?.name || '-'; })()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Top3Scorers;