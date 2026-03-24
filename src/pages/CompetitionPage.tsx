import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '@/context/DataContext';

import { Match, CompetitionType } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import MatchDetailModal from '@/components/MatchDetailModal';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  type: CompetitionType;
  title: string;
}

const CompetitionPage: React.FC<Props> = ({ type, title }) => {
  const { competitions, matches, getActiveSeason, calculateStandings, getAggregatedScorers, getTeamById, teams } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'ndeshjet' | 'tabela' | 'golashenuesit'>('ndeshjet');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const comp = useMemo(() =>
    competitions.find(c => c.type === type && (activeSeason ? c.seasonId === activeSeason.id : true)),
    [competitions, type, activeSeason]
  );

  const compMatches = useMemo(() =>
    comp ? matches.filter(m => m.competitionId === comp.id) : [],
    [comp, matches]
  );

  const weeks = useMemo(() => {
    const ws = [...new Set(compMatches.map(m => m.week))].sort((a, b) => a - b);
    return ws;
  }, [compMatches]);

  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Update selectedWeek when weeks change
  useEffect(() => {
    if (weeks.length > 0 && !weeks.includes(selectedWeek)) {
      setSelectedWeek(weeks[weeks.length - 1]);
    }
  }, [weeks]);


  const weekMatches = useMemo(() => {
    let filtered = compMatches.filter(m => m.week === selectedWeek);
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    return filtered;
  }, [compMatches, selectedWeek, statusFilter]);

  const standings = useMemo(() => comp ? calculateStandings(comp.id) : [], [comp, calculateStandings]);
  const scorers = useMemo(() => comp ? getAggregatedScorers(comp.id).slice(0, 20) : [], [comp, getAggregatedScorers]);

  const isSuperliga = type === 'superliga';

  const getRowColor = (pos: number) => {
    if (isSuperliga) {
      if (pos <= 2) return 'bg-green-50 border-l-4 border-l-[#4CAF50]';
      if (pos <= 6) return 'bg-orange-50 border-l-4 border-l-[#FF9800]';
      if (pos === 7) return 'border-l-4 border-l-gray-300';
      if (pos === 8) return 'bg-yellow-50 border-l-4 border-l-[#FFC107]';
      if (pos >= 9) return 'bg-red-50 border-l-4 border-l-[#F44336]';
    } else {
      if (pos <= 2) return 'bg-green-50 border-l-4 border-l-[#4CAF50]';
      if (pos === 3) return 'bg-orange-50 border-l-4 border-l-[#FF9800]';
      return 'border-l-4 border-l-gray-200';
    }
    return '';
  };

  const liveMatches = weekMatches.filter(m => m.status === 'live');
  const finishedMatches = weekMatches.filter(m => m.status === 'finished');
  const plannedMatches = weekMatches.filter(m => m.status === 'planned');

  const weekIdx = weeks.indexOf(selectedWeek);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          {(['ndeshjet', 'tabela', 'golashenuesit'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-[#1E6FF2] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'ndeshjet' ? 'Ndeshjet' : tab === 'tabela' ? 'Tabela' : 'Golashënuesit'}
            </button>
          ))}
        </div>

        {/* Matches Tab */}
        {activeTab === 'ndeshjet' && (
          <div>
            {weeks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nuk ka ndeshje të regjistruara.</p>
            ) : (
              <>
                {/* Week Selector */}
                <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <button
                    onClick={() => weekIdx > 0 && setSelectedWeek(weeks[weekIdx - 1])}
                    disabled={weekIdx <= 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedWeek}
                      onChange={e => setSelectedWeek(Number(e.target.value))}
                      className="text-lg font-bold text-gray-800 bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                      {weeks.map(w => (
                        <option key={w} value={w}>Java {w}</option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-400">
                      ({weekIdx + 1} nga {weeks.length})
                    </span>
                  </div>
                  <button
                    onClick={() => weekIdx < weeks.length - 1 && setSelectedWeek(weeks[weekIdx + 1])}
                    disabled={weekIdx >= weeks.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 mb-4">
                  {[
                    { value: 'all', label: 'Të gjitha' },
                    { value: 'finished', label: 'Përfunduara' },
                    { value: 'planned', label: 'Ardhshme' },
                    { value: 'live', label: 'Live' },
                  ].map(f => (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        statusFilter === f.value ? 'bg-[#1E6FF2] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {weekMatches.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nuk ka ndeshje për këtë javë.</p>
                ) : (
                  <div className="space-y-6">
                    {liveMatches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                          <h3 className="font-semibold text-red-600">LIVE</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {liveMatches.map(m => (
                            <div key={m.id} className="ring-2 ring-red-400 rounded-3xl">
                              <MatchCard match={m} onClick={setSelectedMatch} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {finishedMatches.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          Ndeshjet e Përfunduara
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {finishedMatches.map(m => (
                            <MatchCard key={m.id} match={m} onClick={setSelectedMatch} />
                          ))}
                        </div>
                      </div>
                    )}
                    {plannedMatches.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#1E6FF2] rounded-full" />
                          Ndeshjet e Ardhshme
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {plannedMatches.map(m => (
                            <MatchCard key={m.id} match={m} onClick={setSelectedMatch} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'tabela' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            {standings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nuk ka të dhëna për tabelën.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <th className="px-3 py-3 text-left w-10">#</th>
                    <th className="px-3 py-3 text-left">Skuadra</th>
                    <th className="px-3 py-3 text-center">ND</th>
                    <th className="px-3 py-3 text-center">F</th>
                    <th className="px-3 py-3 text-center">B</th>
                    <th className="px-3 py-3 text-center">H</th>
                    <th className="px-3 py-3 text-center">G</th>
                    <th className="px-3 py-3 text-center">DG</th>
                    <th className="px-3 py-3 text-center font-bold">P</th>
                    <th className="px-3 py-3 text-center hidden md:table-cell">Forma</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.teamId} className={`${getRowColor(i + 1)} hover:bg-gray-50/50`}>
                      <td className="px-3 py-2.5 font-bold text-gray-600">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <Link to={`/skuadra/${row.teamId}`} className="flex items-center gap-2 hover:text-[#1E6FF2]">
                          <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            {row.teamLogo ? <img src={row.teamLogo} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center w-full h-full text-[8px] text-gray-400">{row.teamName.charAt(0)}</span>}
                          </div>
                          <span className="font-medium text-gray-800">{row.teamName}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-center">{row.played}</td>
                      <td className="px-3 py-2.5 text-center">{row.won}</td>
                      <td className="px-3 py-2.5 text-center">{row.drawn}</td>
                      <td className="px-3 py-2.5 text-center">{row.lost}</td>
                      <td className="px-3 py-2.5 text-center">{row.goalsFor}:{row.goalsAgainst}</td>
                      <td className="px-3 py-2.5 text-center font-medium" style={{ color: row.goalDifference > 0 ? '#4CAF50' : row.goalDifference < 0 ? '#F44336' : '#666' }}>
                        {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-[#1E6FF2]">{row.points}</td>
                      <td className="px-3 py-2.5 text-center hidden md:table-cell">
                        <div className="flex justify-center gap-1">
                          {row.form.map((f, fi) => (
                            <span key={fi} className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${f === 'W' ? 'bg-green-500' : f === 'L' ? 'bg-red-500' : 'bg-gray-400'}`}>
                              {f === 'W' ? 'F' : f === 'L' ? 'H' : 'B'}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Scorers Tab */}
        {activeTab === 'golashenuesit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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

export default CompetitionPage;
