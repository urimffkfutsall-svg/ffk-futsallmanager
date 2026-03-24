import React from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PlayerOfWeekPage: React.FC = () => {
  const { playersOfWeek, getTeamById, getActiveSeason, seasons } = useData();
  const activeSeason = getActiveSeason();

  const filtered = activeSeason
    ? playersOfWeek.filter(p => p.seasonId === activeSeason.id)
    : playersOfWeek;

  const sorted = [...filtered].sort((a, b) => b.week - a.week);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Lojtari i Javës</h1>

        {sorted.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nuk ka Lojtar të Javës të zgjedhur aktualisht.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map(pow => {
              const team = getTeamById(pow.teamId);
              return (
                <div
                  key={pow.id}
                  className="bg-gradient-to-br from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      {pow.photo ? (
                        <img src={pow.photo} alt={pow.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl font-bold">
                          {pow.firstName.charAt(0)}{pow.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-1">Java {pow.week}</p>
                      <h3 className="text-lg font-bold">{pow.firstName} {pow.lastName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {team?.logo && <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />}
                        <span className="text-sm text-gray-300">{team?.name || '-'}</span>
                      </div>
                      {pow.isScorer && (
                        <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                          Golashënues - {pow.goalsCount} gola
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PlayerOfWeekPage;
