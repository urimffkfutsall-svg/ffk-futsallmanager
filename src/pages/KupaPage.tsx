import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Match } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import MatchDetailModal from '@/components/MatchDetailModal';

const KupaPage: React.FC = () => {
  const { competitions, matches, getActiveSeason, getTeamById, getAggregatedScorers } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'bracket' | 'golashenuesit'>('bracket');

  const comp = useMemo(() =>
    competitions.find(c => c.type === 'kupa' && (activeSeason ? c.seasonId === activeSeason.id : true)),
    [competitions, activeSeason]
  );

  const cupMatches = useMemo(() =>
    comp ? matches.filter(m => m.competitionId === comp.id) : [],
    [comp, matches]
  );

  // Group by rounds (weeks represent rounds in cup)
  const rounds = useMemo(() => {
    const roundMap: Record<number, Match[]> = {};
    cupMatches.forEach(m => {
      if (!roundMap[m.week]) roundMap[m.week] = [];
      roundMap[m.week].push(m);
    });
    return Object.entries(roundMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([round, ms]) => ({ round: Number(round), matches: ms }));
  }, [cupMatches]);

  const roundNames: Record<number, string> = {
    1: 'Raundi 1',
    2: 'Çerekfinalet',
    3: 'Gjysmëfinalet',
    4: 'Finalja',
  };

  const scorers = useMemo(() => comp ? getAggregatedScorers(comp.id).slice(0, 20) : [], [comp, getAggregatedScorers]);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Kupa e Kosovës</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bracket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bracket' ? 'bg-[#1E6FF2] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Bracket
          </button>
          <button
            onClick={() => setActiveTab('golashenuesit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'golashenuesit' ? 'bg-[#1E6FF2] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Golashënuesit
          </button>
        </div>

        {activeTab === 'bracket' && (
          rounds.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nuk ka ndeshje të regjistruara në Kupë.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-max pb-4">
                {rounds.map(r => (
                  <div key={r.round} className="min-w-[280px]">
                    <h3 className="text-sm font-bold text-[#1E6FF2] mb-4 text-center uppercase tracking-wider">
                      {roundNames[r.round] || `Raundi ${r.round}`}
                    </h3>
                    <div className="space-y-4">
                      {r.matches.map(m => {
                        const home = getTeamById(m.homeTeamId);
                        const away = getTeamById(m.awayTeamId);
                        const isFinished = m.status === 'finished';
                        const homeWon = isFinished && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                        const awayWon = isFinished && (m.awayScore ?? 0) > (m.homeScore ?? 0);

                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMatch(m)}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className={`flex items-center justify-between px-3 py-2.5 ${homeWon ? 'bg-green-50' : ''}`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                  {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400">{home?.name?.charAt(0) || '?'}</span>}
                                </div>
                                <span className={`text-sm truncate ${homeWon ? 'font-bold' : ''}`}>{home?.name || 'TBD'}</span>
                              </div>
                              <span className={`text-sm font-bold ${homeWon ? 'text-green-600' : 'text-gray-600'}`}>
                                {isFinished ? m.homeScore : '-'}
                              </span>
                            </div>
                            <div className="border-t border-gray-100" />
                            <div className={`flex items-center justify-between px-3 py-2.5 ${awayWon ? 'bg-green-50' : ''}`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                  {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400">{away?.name?.charAt(0) || '?'}</span>}
                                </div>
                                <span className={`text-sm truncate ${awayWon ? 'font-bold' : ''}`}>{away?.name || 'TBD'}</span>
                              </div>
                              <span className={`text-sm font-bold ${awayWon ? 'text-green-600' : 'text-gray-600'}`}>
                                {isFinished ? m.awayScore : '-'}
                              </span>
                            </div>
                            {m.status === 'live' && (
                              <div className="bg-red-500 text-white text-center text-xs py-1 font-bold flex items-center justify-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                LIVE
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {activeTab === 'golashenuesit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
            {scorers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nuk ka golashënues të regjistruar.</p>
            ) : (
              <>
                <div className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <span>#</span><span></span><span>Lojtari</span><span>Skuadra</span><span className="text-right">Gola</span>
                </div>
                {scorers.map((s, i) => {
                  const team = getTeamById(s.teamId);
                  return (
                    <div key={s.id} className="grid grid-cols-[40px_48px_1fr_auto_60px] gap-3 px-4 py-3 items-center border-t border-gray-50 hover:bg-gray-50">
                      <span className={`text-sm font-bold ${i < 3 ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>{i + 1}</span>
                      <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
                        {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                      <div className="flex items-center gap-1.5">
                        {team?.logo && <img src={team.logo} alt="" className="w-5 h-5 rounded-full" />}
                        <span className="text-xs text-gray-500 hidden sm:inline">{team?.name || '-'}</span>
                      </div>
                      <span className="text-right text-sm font-bold text-[#1E6FF2]">{s.goals}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};

export default KupaPage;
