import React from 'react';
import { useData } from '@/context/DataContext';

const TopScorersSection: React.FC = () => {
  const { getAggregatedScorers, getTeamById } = useData();
  const scorers = getAggregatedScorers().slice(0, 10);

  if (scorers.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Golashënuesit Kryesorë</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <span>#</span>
            <span></span>
            <span>Lojtari</span>
            <span>Skuadra</span>
            <span className="text-right">Gola</span>
          </div>
          {scorers.map((s, i) => {
            const team = getTeamById(s.teamId);
            return (
              <div
                key={s.id}
                className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3 items-center border-t border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-sm font-bold ${i < 3 ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {s.photo ? (
                    <img src={s.photo} alt={s.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                      {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {s.firstName} {s.lastName}
                </span>
                <div className="flex items-center gap-1.5">
                  {team?.logo && <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />}
                  <span className="text-xs text-gray-500 hidden sm:inline">{team?.name || '-'}</span>
                </div>
                <span className="text-right text-sm font-bold text-[#1E6FF2]">{s.goals}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopScorersSection;
