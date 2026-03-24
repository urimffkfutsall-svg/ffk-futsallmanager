import React, { useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { Activity, Target, Swords, Users, TrendingUp, TrendingDown, Minus, BarChart2, ChevronRight } from 'lucide-react';

const COLORS = ['#1E6FF2', '#f97316', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

const StatistikatPage: React.FC = () => {
  const { competitions, matches, teams, players, getActiveSeason, getAggregatedScorers, calculateStandings, getTeamById } = useData();
  const activeSeason = getActiveSeason();
  const [selectedCompId, setSelectedCompId] = useState<string>('all');

  const activeComps = useMemo(() =>
    competitions.filter(c => activeSeason ? c.seasonId === activeSeason.id : true),
    [competitions, activeSeason]
  );

  const filteredMatches = useMemo(() => {
    let m = matches;
    if (activeSeason) m = m.filter(x => x.seasonId === activeSeason.id);
    if (selectedCompId !== 'all') m = m.filter(x => x.competitionId === selectedCompId);
    return m;
  }, [matches, activeSeason, selectedCompId]);

  const finishedMatches = filteredMatches.filter(m => m.status === 'finished');
  const liveMatches = filteredMatches.filter(m => m.status === 'live');
  const totalGoals = finishedMatches.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const avgGoals = finishedMatches.length > 0 ? (totalGoals / finishedMatches.length).toFixed(2) : '0';
  const homeWins = finishedMatches.filter(m => (m.homeScore ?? 0) > (m.awayScore ?? 0)).length;
  const awayWins = finishedMatches.filter(m => (m.awayScore ?? 0) > (m.homeScore ?? 0)).length;
  const draws = finishedMatches.filter(m => (m.homeScore ?? 0) === (m.awayScore ?? 0)).length;

  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);
  const compTeams = selectedCompId !== 'all' ? teams.filter(t => t.competitionId === selectedCompId) : activeTeams;

  const scorers = getAggregatedScorers(selectedCompId !== 'all' ? selectedCompId : undefined).slice(0, 10);

  const pieData = [
    { name: 'Fitore Shtëpi', value: homeWins, color: '#1E6FF2' },
    { name: 'Fitore Jashtë', value: awayWins, color: '#f97316' },
    { name: 'Barazime', value: draws, color: '#f59e0b' },
  ];

  // Goals per week trend
  const weekGoals = useMemo(() => {
    const map: Record<number, number> = {};
    finishedMatches.forEach(m => {
      const w = m.week || 0;
      map[w] = (map[w] || 0) + (m.homeScore ?? 0) + (m.awayScore ?? 0);
    });
    return Object.entries(map).sort((a, b) => +a[0] - +b[0]).slice(-10).map(([w, g]) => ({ java: `J${w}`, gola: g }));
  }, [finishedMatches]);

  // Team attack/defense stats
  const teamStats = useMemo(() => {
    return compTeams.map(t => {
      const tm = finishedMatches.filter(m => m.homeTeamId === t.id || m.awayTeamId === t.id);
      let gf = 0, ga = 0, w = 0;
      tm.forEach(m => {
        const isHome = m.homeTeamId === t.id;
        const myG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
        const thG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
        gf += myG; ga += thG;
        if (myG > thG) w++;
      });
      return { name: t.name, logo: t.logo, gf, ga, w, played: tm.length };
    }).filter(t => t.played > 0).sort((a, b) => b.gf - a.gf).slice(0, 8);
  }, [compTeams, finishedMatches]);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0A1E3C] via-[#0d2a52] to-[#1E6FF2] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="w-6 h-6 text-blue-300" />
            <h1 className="text-2xl font-black">Statistikat</h1>
            {activeSeason && <span className="bg-white/10 text-blue-200 text-xs px-3 py-1 rounded-full">{activeSeason.name}</span>}
          </div>

          {/* Filter Tabs & Individual Stats Button */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCompId('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCompId === 'all' ? 'bg-white text-[#0A1E3C]' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}>
              Të Gjitha
            </button>
            {activeComps.map(c => (
              <button key={c.id} onClick={() => setSelectedCompId(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCompId === c.id ? 'bg-white text-[#0A1E3C]' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}>
                {c.name}
              </button>
            ))}
          </div>
          <Link to="/statistikat/individuale" className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200/30 hover:shadow-orange-300/40 transition-all">Statistikat Individuale</Link>

          {/* Top KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {[
              { icon: <Swords className="w-5 h-5"/>, label: 'Ndeshje', val: finishedMatches.length, sub: `${liveMatches.length} live` },
              { icon: <Target className="w-5 h-5"/>, label: 'Gola Totale', val: totalGoals, sub: `${avgGoals} mesatare` },
              { icon: <Users className="w-5 h-5"/>, label: 'Skuadra', val: compTeams.length, sub: 'aktive' },
              { icon: <TrendingUp className="w-5 h-5"/>, label: 'Fitore Shtëpi', val: homeWins, sub: `${finishedMatches.length > 0 ? Math.round((homeWins/finishedMatches.length)*100) : 0}%` },
              { icon: <Activity className="w-5 h-5"/>, label: 'Barazime', val: draws, sub: `${finishedMatches.length > 0 ? Math.round((draws/finishedMatches.length)*100) : 0}%` },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-2 text-blue-300 mb-2">{s.icon}<span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span></div>
                <p className="text-3xl font-black">{s.val}</p>
                <p className="text-xs text-blue-300 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Row 1: Area Chart + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-800">Gola sipas Javëve</h3>
              <span className="text-xs text-gray-400">10 javët e fundit</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Trendi i golave gjatë sezonit</p>
            {weekGoals.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weekGoals}>
                  <defs>
                    <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E6FF2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1E6FF2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                  <XAxis dataKey="java" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}/>
                  <Area type="monotone" dataKey="gola" stroke="#1E6FF2" strokeWidth={2.5} fill="url(#gG)" name="Gola"/>
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center py-12">Nuk ka të dhëna.</p>}
          </div>

          {/* Pie Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-1">Rezultatet</h3>
            <p className="text-xs text-gray-400 mb-4">Shpërndarje e rezultateve</p>
            {finishedMatches.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" strokeWidth={0}>
                      {pieData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v,n)=>[v,n]}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:d.color}}/>
                      <span className="text-xs text-gray-600 flex-1">{d.name}</span>
                      <span className="font-bold text-sm text-gray-800">{d.value}</span>
                      <span className="text-xs text-gray-400 w-9 text-right">
                        {finishedMatches.length > 0 ? Math.round((d.value/finishedMatches.length)*100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-gray-400 text-sm text-center py-8">Nuk ka të dhëna.</p>}
          </div>
        </div>

        {/* Row 2: Top Scorers List + Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scorers List - dashboard style */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800">Golashënuesit Kryesorë</h3>
                <p className="text-xs text-gray-400 mt-0.5">Top 10 sipas golave</p>
              </div>
              <span className="bg-[#1E6FF2]/10 text-[#1E6FF2] text-xs font-bold px-3 py-1 rounded-full">Top 10</span>
            </div>
            {scorers.length === 0
              ? <p className="text-gray-400 text-sm text-center py-8">Nuk ka të dhëna.</p>
              : (
                <div className="space-y-2">
                  {scorers.map((s, i) => {
                    const team = getTeamById(s.teamId);
                    const maxGoals = scorers[0]?.goals || 1;
                    const pct = (s.goals / maxGoals) * 100;
                    return (
                      <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                        {/* Rank */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {i + 1}
                        </div>
                        {/* Photo */}
                        <div className="w-9 h-9 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {s.photo
                            ? <img src={s.photo} alt="" className="w-full h-full object-cover"/>
                            : <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-400">{s.firstName.charAt(0)}{s.lastName.charAt(0)}</div>}
                        </div>
                        {/* Name + Team + Bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800 truncate">{s.firstName} {s.lastName}</span>
                            <span className="font-black text-[#1E6FF2] text-sm ml-2">{s.goals}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {team?.logo && <img src={team.logo} alt="" className="w-4 h-4 rounded object-cover flex-shrink-0"/>}
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1E6FF2] rounded-full transition-all" style={{width:`${pct}%`}}/>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0 w-16 truncate">{team?.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Team Attack/Defense */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800">Sulmi & Mbrojtja</h3>
                <p className="text-xs text-gray-400 mt-0.5">Gola shënuar vs pësuar</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1 text-gray-500"><span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"/>Shënuar</span>
                <span className="flex items-center gap-1 text-gray-500"><span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"/>Pësuar</span>
              </div>
            </div>
            {teamStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={teamStats} layout="vertical" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <YAxis dataKey="name" type="category" width={90} tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}/>
                  <Bar dataKey="gf" fill="#22c55e" name="Shënuar" radius={[0,4,4,0]}/>
                  <Bar dataKey="ga" fill="#ef4444" name="Pësuar" radius={[0,4,4,0]}/>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center py-12">Nuk ka të dhëna.</p>}
          </div>
        </div>

        {/* Row 3: Stat Comparison Bars across teams */}
        {compTeams.length > 0 && finishedMatches.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800">Performanca e Skuadrave</h3>
                <p className="text-xs text-gray-400 mt-0.5">Normë fitoresh sipas skuadrës</p>
              </div>
            </div>
            <div className="space-y-3">
              {teamStats.slice(0, 6).map((t, i) => {
                const winRate = t.played > 0 ? Math.round((t.w / t.played) * 100) : 0;
                const team = compTeams.find(x => x.name === t.name);
                return (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      {team?.logo
                        ? <img src={team.logo} alt="" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-xs font-black text-gray-400">{t.name.charAt(0)}</div>}
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-32 truncate flex-shrink-0">{t.name}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${winRate}%`,
                        background: `hsl(${210 + i * 25}, 70%, 55%)`
                      }}/>
                    </div>
                    <span className="text-sm font-bold text-gray-800 w-10 text-right">{winRate}%</span>
                    <span className="text-xs text-gray-400 w-16 text-right">{t.w}F {t.played}N</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* H2H CTA */}
        <div className="bg-gradient-to-r from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">Krahasimi Head-to-Head</h3>
            <p className="text-blue-200 text-sm mt-0.5">Krahaso dy skuadra dhe shiko statistikat e ndeshjeve direkte</p>
          </div>
          <Link to="/head-to-head"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0A1E3C] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex-shrink-0">
            Krahaso <ChevronRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StatistikatPage;
