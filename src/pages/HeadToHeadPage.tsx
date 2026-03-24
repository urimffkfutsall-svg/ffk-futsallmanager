import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Match } from '@/types';
import MatchCard from '@/components/MatchCard';
import MatchDetailModal from '@/components/MatchDetailModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Swords, Trophy, Target, Shield, TrendingUp, Activity, ChevronRight } from 'lucide-react';

const HeadToHeadPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { teams, getHeadToHead, getTeamById, getActiveSeason, matches: allMatches } = useData();
  const activeSeason = getActiveSeason();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  const activeTeams = activeSeason ? teams.filter(t => t.seasonId === activeSeason.id) : teams;
  const [teamAId, setTeamAId] = useState<string>(searchParams.get('teamA') || '');
  const [teamBId, setTeamBId] = useState<string>(searchParams.get('teamBId') || '');

  const h2h = useMemo(() => {
    if (!teamAId || !teamBId) return null;
    return getHeadToHead(teamAId, teamBId);
  }, [teamAId, teamBId, getHeadToHead]);

  const teamA = getTeamById(teamAId);
  const teamB = getTeamById(teamBId);

  // Individual team overall stats for season
  const teamStats = useMemo(() => {
    const calc = (tid: string) => {
      const ms = allMatches.filter(m => (m.homeTeamId === tid || m.awayTeamId === tid) && m.status === 'finished');
      let w = 0, d = 0, l = 0, gf = 0, ga = 0, cs = 0;
      ms.forEach(m => {
        const isHome = m.homeTeamId === tid;
        const myG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
        const thG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
        gf += myG; ga += thG;
        if (thG === 0) cs++;
        if (myG > thG) w++; else if (myG < thG) l++; else d++;
      });
      const played = ms.length;
      return { played, w, d, l, gf, ga, cs, winRate: played > 0 ? Math.round((w / played) * 100) : 0, avgGf: played > 0 ? +(gf / played).toFixed(1) : 0 };
    };
    return { a: calc(teamAId), b: calc(teamBId) };
  }, [teamAId, teamBId, allMatches]);

  const radarData = teamA && teamB && h2h ? [
    { stat: 'Fitore', A: teamStats.a.w, B: teamStats.b.w },
    { stat: 'Gola', A: teamStats.a.gf, B: teamStats.b.gf },
    { stat: 'Normë %', A: teamStats.a.winRate, B: teamStats.b.winRate },
    { stat: 'Clean Sh.', A: teamStats.a.cs, B: teamStats.b.cs },
    { stat: 'Ndeshje', A: teamStats.a.played, B: teamStats.b.played },
  ] : [];

  const barData = h2h && teamA && teamB ? [
    { name: 'Fitore H2H', A: h2h.teamAWins, B: h2h.teamBWins },
    { name: 'Gola H2H', A: h2h.teamAGoals, B: h2h.teamBGoals },
    { name: 'Fitore Total', A: teamStats.a.w, B: teamStats.b.w },
    { name: 'Gola Total', A: teamStats.a.gf, B: teamStats.b.gf },
  ] : [];

  const total = h2h ? h2h.teamAWins + h2h.draws + h2h.teamBWins : 0;
  const aPct = total > 0 ? Math.round((h2h!.teamAWins / total) * 100) : 0;
  const dPct = total > 0 ? Math.round((h2h!.draws / total) * 100) : 0;
  const bPct = total > 0 ? 100 - aPct - dPct : 0;

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0A1E3C] via-[#0d2a52] to-[#1E6FF2] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Swords className="w-6 h-6 text-blue-300" />
            <h1 className="text-2xl font-black">Krahasimi Head-to-Head</h1>
          </div>

          {/* Team Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs text-blue-300 font-semibold mb-1.5 uppercase tracking-wider">Skuadra A</label>
              <select value={teamAId} onChange={e => setTeamAId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur">
                <option value="" className="text-gray-800">Zgjedh skuadrën...</option>
                {activeTeams.map(t => <option key={t.id} value={t.id} className="text-gray-800">{t.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-lg font-black text-blue-200">VS</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-blue-300 font-semibold mb-1.5 uppercase tracking-wider">Skuadra B</label>
              <select value={teamBId} onChange={e => setTeamBId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur">
                <option value="" className="text-gray-800">Zgjedh skuadrën...</option>
                {activeTeams.filter(t => t.id !== teamAId).map(t => <option key={t.id} value={t.id} className="text-gray-800">{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* VS Panel */}
          {h2h && teamA && teamB && (
            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                {/* Team A */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 overflow-hidden mb-3 shadow-xl">
                    {teamA.logo ? <img src={teamA.logo} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/30">{teamA.name.charAt(0)}</div>}
                  </div>
                  <h2 className="font-black text-lg text-center">{teamA.name}</h2>
                  <p className="text-blue-300 text-sm mt-0.5">{teamStats.a.winRate}% fitore</p>
                </div>

                {/* Score */}
                <div className="text-center px-4 flex-shrink-0">
                  <div className="text-5xl font-black tracking-tight">
                    <span className="text-green-400">{h2h.teamAWins}</span>
                    <span className="text-white/40 mx-3">-</span>
                    <span className="text-yellow-400">{h2h.draws}</span>
                    <span className="text-white/40 mx-3">-</span>
                    <span className="text-red-400">{h2h.teamBWins}</span>
                  </div>
                  <p className="text-blue-300 text-xs mt-2 font-medium">{h2h.matches.length} ndeshje • F - B - H</p>

                  {/* Progress bar */}
                  {total > 0 && (
                    <div className="flex rounded-full overflow-hidden h-2.5 mt-3 w-48 mx-auto">
                      <div className="bg-green-400 transition-all" style={{ width: `${aPct}%` }} />
                      <div className="bg-yellow-400 transition-all" style={{ width: `${dPct}%` }} />
                      <div className="bg-red-400 transition-all" style={{ width: `${bPct}%` }} />
                    </div>
                  )}
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 overflow-hidden mb-3 shadow-xl">
                    {teamB.logo ? <img src={teamB.logo} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/30">{teamB.name.charAt(0)}</div>}
                  </div>
                  <h2 className="font-black text-lg text-center">{teamB.name}</h2>
                  <p className="text-blue-300 text-sm mt-0.5">{teamStats.b.winRate}% fitore</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-white/10 mt-8">
                {[{ k: 'overview', l: 'Përmbledhje' }, { k: 'history', l: 'Historiku' }].map(t => (
                  <button key={t.k} onClick={() => setActiveTab(t.k as any)}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.k ? 'border-white text-white' : 'border-transparent text-blue-300 hover:text-white'}`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {(!teamAId || !teamBId) && (
          <div className="text-center py-20">
            <Swords className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">Zgjedh dy skuadra për të parë krahasimin.</p>
          </div>
        )}

        {teamAId && teamBId && h2h && teamA && teamB && (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">

                {/* KPI Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Ndeshje H2H', valA: h2h.teamAWins, valB: h2h.teamBWins, mid: h2h.draws, midLabel: 'Barazime', icon: <Swords className="w-5 h-5" /> },
                  ].map((_, i) => null)}
                  <CompareCard label="Fitore H2H" valA={h2h.teamAWins} valB={h2h.teamBWins} nameA={teamA.name} nameB={teamB.name} icon={<Trophy className="w-5 h-5" />} />
                  <CompareCard label="Gola H2H" valA={h2h.teamAGoals} valB={h2h.teamBGoals} nameA={teamA.name} nameB={teamB.name} icon={<Target className="w-5 h-5" />} />
                  <CompareCard label="Fitore Totale" valA={teamStats.a.w} valB={teamStats.b.w} nameA={teamA.name} nameB={teamB.name} icon={<TrendingUp className="w-5 h-5" />} />
                  <CompareCard label="Gola Totale" valA={teamStats.a.gf} valB={teamStats.b.gf} nameA={teamA.name} nameB={teamB.name} icon={<Activity className="w-5 h-5" />} />
                </div>

                {/* Bar Chart + Radar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-1">Krahasimi Statistikor</h3>
                    <div className="flex gap-4 mb-4">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-[#1E6FF2] inline-block" />{teamA.name}</span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />{teamB.name}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={barData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="A" fill="#1E6FF2" name={teamA.name} radius={[5, 5, 0, 0]} />
                        <Bar dataKey="B" fill="#f97316" name={teamB.name} radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Radar Krahasues</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#f0f0f0" />
                        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                        <Radar name={teamA.name} dataKey="A" stroke="#1E6FF2" fill="#1E6FF2" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name={teamB.name} dataKey="B" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stat Comparison Bars */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-800 mb-6">Statistikat Krahasuese</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Normë Fitoresh', a: teamStats.a.winRate, b: teamStats.b.winRate, suffix: '%' },
                      { label: 'Gola Shënuar (total)', a: teamStats.a.gf, b: teamStats.b.gf, suffix: '' },
                      { label: 'Gola Pësuar (total)', a: teamStats.a.ga, b: teamStats.b.ga, suffix: '' },
                      { label: 'Mesatare Gola/Ndeshje', a: teamStats.a.avgGf, b: teamStats.b.avgGf, suffix: '' },
                      { label: 'Clean Sheets', a: teamStats.a.cs, b: teamStats.b.cs, suffix: '' },
                      { label: 'Fitore H2H', a: h2h.teamAWins, b: h2h.teamBWins, suffix: '' },
                      { label: 'Gola H2H', a: h2h.teamAGoals, b: h2h.teamBGoals, suffix: '' },
                    ].map(row => {
                      const total = +row.a + +row.b;
                      const aPct = total > 0 ? (+row.a / total) * 100 : 50;
                      const bPct = total > 0 ? (+row.b / total) * 100 : 50;
                      return (
                        <div key={row.label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-[#1E6FF2]">{row.a}{row.suffix}</span>
                            <span className="text-gray-500 text-xs font-medium">{row.label}</span>
                            <span className="font-bold text-orange-500">{row.b}{row.suffix}</span>
                          </div>
                          <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
                            <div className="bg-[#1E6FF2] h-full transition-all rounded-l-full" style={{ width: `${aPct}%` }} />
                            <div className="bg-orange-500 h-full transition-all rounded-r-full" style={{ width: `${bPct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex gap-6 mt-5 pt-4 border-t border-gray-50">
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#1E6FF2]">
                      <span className="w-4 h-4 rounded bg-[#1E6FF2] inline-block" />{teamA.name}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-orange-500">
                      <span className="w-4 h-4 rounded bg-orange-500 inline-block" />{teamB.name}
                    </span>
                  </div>
                </div>

                {/* Last H2H match preview */}
                {h2h.matches.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800">Ndeshja e Fundit Direkte</h3>
                      <button onClick={() => setActiveTab('history')} className="text-sm text-[#1E6FF2] hover:underline flex items-center gap-1">
                        Historiku i plotë <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {h2h.matches.slice(-2).reverse().map(m => (
                        <MatchCard key={m.id} match={m} onClick={setSelectedMatch} compact />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Historiku i Ndeshjeve ({h2h.matches.length})
                </h3>
                {h2h.matches.length === 0
                  ? <p className="text-gray-400 text-sm text-center py-8">Nuk ka ndeshje direkte mes këtyre dy skuadrave.</p>
                  : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {h2h.matches.slice().reverse().map(m => (
                      <MatchCard key={m.id} match={m} onClick={setSelectedMatch} compact />
                    ))}
                  </div>
                }
              </div>
            )}
          </>
        )}

        {teamAId && teamBId && h2h && h2h.matches.length === 0 && teamA && teamB && (
          <div className="text-center py-16">
            <Swords className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Nuk ka ndeshje direkte mes {teamA.name} dhe {teamB.name}.</p>
          </div>
        )}
      </div>

      <Footer />
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
};

const CompareCard: React.FC<{ label: string; valA: number; valB: number; nameA: string; nameB: string; icon: React.ReactNode }> = ({ label, valA, valB, nameA, nameB, icon }) => {
  const winner = valA > valB ? 'A' : valA < valB ? 'B' : 'draw';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3 text-gray-400">{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-center flex-1">
          <p className={`text-3xl font-black ${winner === 'A' ? 'text-[#1E6FF2]' : 'text-gray-400'}`}>{valA}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{nameA}</p>
        </div>
        <div className="text-gray-200 text-lg font-black mb-1">—</div>
        <div className="text-center flex-1">
          <p className={`text-3xl font-black ${winner === 'B' ? 'text-orange-500' : 'text-gray-400'}`}>{valB}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{nameB}</p>
        </div>
      </div>
      {winner !== 'draw' && (
        <div className={`mt-3 text-center text-xs font-bold px-2 py-1 rounded-full ${winner === 'A' ? 'bg-blue-50 text-[#1E6FF2]' : 'bg-orange-50 text-orange-500'}`}>
          {winner === 'A' ? nameA : nameB} kryeson
        </div>
      )}
    </div>
  );
};

export default HeadToHeadPage;
