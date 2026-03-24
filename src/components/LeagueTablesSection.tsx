import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';

const LeagueTablesSection: React.FC<{ inline?: boolean }> = ({ inline }) => {
  const { competitions, calculateStandings, getActiveSeason } = useData();
  const activeSeason = getActiveSeason();

  const leagueComps = useMemo(() =>
    competitions.filter(c =>
      (c.type === 'superliga' || c.type === 'liga_pare') &&
      (activeSeason ? c.seasonId === activeSeason.id : true)
    ), [competitions, activeSeason]);

  const [selectedComp, setSelectedComp] = useState<string>(leagueComps[0]?.id || '');
  const standings = useMemo(() => selectedComp ? calculateStandings(selectedComp) : [], [selectedComp, calculateStandings]);
  const currentComp = competitions.find(c => c.id === selectedComp);
  const isSuperliga = currentComp?.type === 'superliga';

  if (leagueComps.length === 0) return null;

  const getZone = (pos: number) => {
    if (isSuperliga) {
      if (pos <= 2) return { color: 'bg-green-500', label: 'Gjysmëfinale' };
      if (pos <= 6) return { color: 'bg-blue-500', label: 'Playoff' };
      if (pos >= 9) return { color: 'bg-red-500', label: 'Bie' };
    } else {
      if (pos <= 2) return { color: 'bg-green-500', label: 'Promovim' };
      if (pos === 3) return { color: 'bg-orange-400', label: 'Playoff' };
    }
    return { color: 'bg-transparent', label: '' };
  };

  return (
    <div className={inline ? "" : "py-10 px-4 bg-white"}>
      <div className={inline ? "" : "max-w-5xl mx-auto"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
          <h2 className="text-2xl font-black text-[#0A1E3C]">Tabela e Ligës</h2>
        </div>

        {leagueComps.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {leagueComps.map(c => (
              <button key={c.id} onClick={() => setSelectedComp(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedComp === c.id ? 'bg-[#0A1E3C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{c.name}</button>
            ))}
          </div>
        )}

        {standings.length === 0
          ? <p className="text-center text-gray-400 py-8">Nuk ka të dhëna për tabelën.</p>
          : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[auto_1fr_repeat(8,auto)] gap-0 bg-[#0A1E3C] text-white text-xs font-bold uppercase tracking-wider">
                <div className="px-3 py-3 w-10 text-center">#</div>
                <div className="px-3 py-3">Skuadra</div>
                <div className="px-3 py-3 w-10 text-center">ND</div>
                <div className="px-3 py-3 w-10 text-center">F</div>
                <div className="px-3 py-3 w-10 text-center">B</div>
                <div className="px-3 py-3 w-10 text-center">H</div>
                <div className="px-3 py-3 w-16 text-center">G</div>
                <div className="px-3 py-3 w-10 text-center">DG</div>
                <div className="px-3 py-3 w-12 text-center text-yellow-400">P</div>
                <div className="px-3 py-3 w-28 text-center hidden md:block">Forma</div>
              </div>

              {standings.map((row, i) => {
                const zone = getZone(i + 1);
                return (
                  <div key={row.teamId}
                    className={`grid grid-cols-[auto_1fr_repeat(8,auto)] gap-0 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    {/* Pos */}
                    <div className="px-3 py-3 w-10 flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        {zone.color !== 'bg-transparent' && <div className={`w-1 h-5 rounded-full ${zone.color}`}/>}
                        <span className="font-bold text-sm text-gray-600">{i + 1}</span>
                      </div>
                    </div>
                    {/* Team */}
                    <div className="px-3 py-3 flex items-center">
                      <Link to={`/skuadra/${row.teamId}`} className="flex items-center gap-2.5 hover:text-[#1E6FF2] transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {row.teamLogo
                            ? <img src={row.teamLogo} alt="" className="w-full h-full object-cover"/>
                            : <span className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-400">{row.teamName.charAt(0)}</span>}
                        </div>
                        <span className="font-semibold text-sm text-gray-800 group-hover:text-[#1E6FF2] truncate">{row.teamName}</span>
                      </Link>
                    </div>
                    <div className="px-3 py-3 w-10 text-center text-sm text-gray-600">{row.played}</div>
                    <div className="px-3 py-3 w-10 text-center text-sm text-gray-600">{row.won}</div>
                    <div className="px-3 py-3 w-10 text-center text-sm text-gray-600">{row.drawn}</div>
                    <div className="px-3 py-3 w-10 text-center text-sm text-gray-600">{row.lost}</div>
                    <div className="px-3 py-3 w-16 text-center text-sm text-gray-600">{row.goalsFor}:{row.goalsAgainst}</div>
                    <div className="px-3 py-3 w-10 text-center text-sm font-semibold" style={{color: row.goalDifference > 0 ? '#22c55e' : row.goalDifference < 0 ? '#ef4444' : '#9ca3af'}}>
                      {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                    </div>
                    <div className="px-3 py-3 w-12 text-center font-black text-[#1E6FF2] text-sm">{row.points}</div>
                    <div className="px-3 py-3 w-28 hidden md:flex items-center justify-center gap-1">
                      {row.form.map((f, fi) => (
                        <span key={fi} className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white ${f==='W'?'bg-green-500':f==='L'?'bg-red-500':'bg-gray-400'}`}>
                          {f==='W'?'F':f==='L'?'H':'B'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500 bg-gray-50">
                {isSuperliga ? (
                  <>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/>Gjysmëfinale Playoff</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"/>Playoff</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"/>Bie në Ligën e Parë</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"/>Promovohen në Superligë</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"/>Playoff Rënie/Ngritje</span>
                  </>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
export default LeagueTablesSection;
