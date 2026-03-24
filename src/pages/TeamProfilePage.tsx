import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import MatchDetailModal from '@/components/MatchDetailModal';
import { Match } from '@/types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Shield, TrendingUp, TrendingDown, Users, Swords, MapPin, Calendar, ArrowRight, Star, Activity, Zap, ChevronUp, ChevronDown, Minus } from 'lucide-react';

const COLORS = { win: '#22c55e', draw: '#f59e0b', loss: '#ef4444', primary: '#1E6FF2', dark: '#0A1E3C' };

const TeamProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { teams, matches, players, competitions, calculateStandings } = useData();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'players' | 'stats'>('overview');

  const team = teams.find(t => t.id === id);
  const comp = competitions.find(c => c.id === team?.competitionId);
  const teamMatches = useMemo(() => matches.filter(m => m.homeTeamId === id || m.awayTeamId === id), [matches, id]);
  const finishedMatches = teamMatches.filter(m => m.status === 'finished');
  const upcomingMatches = teamMatches.filter(m => m.status === 'planned');
  const teamPlayers = players.filter(p => p.teamId === id);

  const stats = useMemo(() => {
    let w = 0, d = 0, l = 0, gf = 0, ga = 0;
    let homeW = 0, homeD = 0, homeL = 0, awayW = 0, awayD = 0, awayL = 0;
    let cleanSheets = 0, failedToScore = 0, bigWins = 0;
    finishedMatches.forEach(m => {
      const isHome = m.homeTeamId === id;
      const myG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
      const theirG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
      gf += myG; ga += theirG;
      if (theirG === 0) cleanSheets++;
      if (myG === 0) failedToScore++;
      if (myG - theirG >= 3) bigWins++;
      if (myG > theirG) { w++; if (isHome) homeW++; else awayW++; }
      else if (myG < theirG) { l++; if (isHome) homeL++; else awayL++; }
      else { d++; if (isHome) homeD++; else awayD++; }
    });
    const played = finishedMatches.length;
    return {
      played, w, d, l, gf, ga,
      winRate: played > 0 ? Math.round((w / played) * 100) : 0,
      avgGf: played > 0 ? +(gf / played).toFixed(1) : 0,
      avgGa: played > 0 ? +(ga / played).toFixed(1) : 0,
      cleanSheets, failedToScore, bigWins,
      homeW, homeD, homeL, awayW, awayD, awayL
    };
  }, [finishedMatches, id]);

  const standings = comp ? calculateStandings(comp.id) : [];
  const position = standings.findIndex(s => s.teamId === id) + 1;
  const standingRow = standings.find(s => s.teamId === id);

  const form = finishedMatches.slice(-10).map(m => {
    const isHome = m.homeTeamId === id;
    const myG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const theirG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
    return myG > theirG ? 'W' : myG < theirG ? 'L' : 'D';
  });

  const areaData = finishedMatches.slice(-8).map((m, i) => {
    const isHome = m.homeTeamId === id;
    return {
      name: `N${i + 1}`,
      shenuar: isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0),
      pesuar: isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0),
    };
  });

  const pieData = [
    { name: 'Fitore', value: stats.w, color: COLORS.win },
    { name: 'Barazim', value: stats.d, color: COLORS.draw },
    { name: 'Humbje', value: stats.l, color: COLORS.loss },
  ];

  if (!team) return (
    <div className="min-h-screen bg-[#F0F2F5]"><Header />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-gray-500">Skuadra nuk u gjet.</p></div>
    <Footer /></div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-[#0A1E3C] via-[#0d2a52] to-[#1E6FF2]">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-0">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6">
            {/* Logo */}
            <div className="w-28 h-28 rounded-3xl bg-white/10 border border-white/20 overflow-hidden flex-shrink-0 shadow-2xl">
              {team.logo
                ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/30">{team.name.charAt(0)}</div>}
            </div>
            {/* Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start flex-wrap">
                {position > 0 && <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">#{position} Renditje</span>}
                {comp && <span className="bg-white/10 text-blue-200 text-xs px-3 py-1 rounded-full">{comp.name}</span>}
              </div>
              <h1 className="text-4xl font-black mb-2">{team.name}</h1>
              <div className="flex items-center gap-4 text-sm text-blue-200 justify-center md:justify-start flex-wrap">
                {team.stadium && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{team.stadium}</span>}
                {team.foundedYear && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>Themeluar {team.foundedYear}</span>}
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/>{teamPlayers.length} Lojtarë</span>
              </div>
              {/* Form */}
              {form.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 justify-center md:justify-start flex-wrap">
                  <span className="text-xs text-blue-300 mr-1">Forma:</span>
                  {form.map((f, i) => (
                    <span key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow ${f==='W'?'bg-green-500':f==='L'?'bg-red-500':'bg-yellow-500'} text-white`}>{f}</span>
                  ))}
                </div>
              )}
            </div>
            {/* KPI strip */}
            <div className="flex gap-6 text-white text-center pb-1">
              {[
                { label: 'Ndeshje', val: stats.played },
                { label: 'Fitore', val: stats.w },
                { label: 'Gola', val: stats.gf },
                { label: 'Pikë', val: standingRow?.points ?? 0 },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black">{s.val}</p>
                  <p className="text-xs text-blue-300 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
            {[{k:'overview',l:'Përmbledhje'},{k:'stats',l:'Statistika'},{k:'matches',l:'Ndeshjet'},{k:'players',l:'Lojtarët'}].map(t => (
              <button key={t.k} onClick={() => setActiveTab(t.k as any)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab===t.k?'border-white text-white':'border-transparent text-blue-300 hover:text-white'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ══ OVERVIEW ══ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard icon={<Trophy/>} label="Fitore" value={stats.w} sub={`Normë ${stats.winRate}%`} trend={stats.w > stats.l ? 'up' : stats.w < stats.l ? 'down' : 'neutral'} color="green"/>
              <KpiCard icon={<Target/>} label="Gola Shënuar" value={stats.gf} sub={`${stats.avgGf} / ndeshje`} trend="up" color="blue"/>
              <KpiCard icon={<Shield/>} label="Clean Sheets" value={stats.cleanSheets} sub={`Portë e mbyllur`} trend="neutral" color="purple"/>
              <KpiCard icon={<Zap/>} label="Pikë" value={standingRow?.points ?? 0} sub={`Pozita #${position || '-'}`} trend="up" color="yellow"/>
            </div>

            {/* Area Chart + Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Area Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-800">Gola Shënuar / Pësuar</h3>
                  <span className="text-xs text-gray-400">8 ndeshjet e fundit</span>
                </div>
                <div className="flex gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-green-400 inline-block"/>Shënuar</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"/>Pësuar</span>
                </div>
                {areaData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="gSh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gPe" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                      <XAxis dataKey="name" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}/>
                      <Area type="monotone" dataKey="shenuar" stroke="#22c55e" strokeWidth={2.5} fill="url(#gSh)" name="Shënuar"/>
                      <Area type="monotone" dataKey="pesuar" stroke="#ef4444" strokeWidth={2.5} fill="url(#gPe)" name="Pësuar"/>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <p className="text-gray-400 text-sm text-center py-12">Nuk ka të dhëna.</p>}
              </div>

              {/* Pie */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Rezultatet</h3>
                {stats.played > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" strokeWidth={0}>
                          {pieData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                        </Pie>
                        <Tooltip formatter={(v,n)=>[v,n]}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:d.color}}/>
                          <span className="text-sm text-gray-600 flex-1">{d.name}</span>
                          <span className="font-bold text-gray-800">{d.value}</span>
                          <span className="text-xs text-gray-400 w-10 text-right">
                            {stats.played>0?Math.round((d.value/stats.played)*100):0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <p className="text-gray-400 text-sm text-center py-8">Nuk ka të dhëna.</p>}
              </div>
            </div>

            {/* Home vs Away + Extra Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home/Away bars */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1E6FF2]"/>Shtëpi vs Jashtë</h3>
                {[
                  {label:'Shtëpi', w:stats.homeW, d:stats.homeD, l:stats.homeL},
                  {label:'Jashtë', w:stats.awayW, d:stats.awayD, l:stats.awayL},
                ].map(row => {
                  const tot = row.w+row.d+row.l;
                  return (
                    <div key={row.label} className="mb-5 last:mb-0">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{row.label}</span>
                        <div className="flex gap-3 text-xs">
                          <span className="text-green-600 font-bold">{row.w}F</span>
                          <span className="text-yellow-600 font-bold">{row.d}B</span>
                          <span className="text-red-600 font-bold">{row.l}H</span>
                        </div>
                      </div>
                      <div className="flex rounded-full overflow-hidden h-4 bg-gray-100">
                        {tot > 0 && <>
                          <div className="bg-green-500 h-full transition-all flex items-center justify-center" style={{width:`${(row.w/tot)*100}%`}}>
                            {row.w > 0 && <span className="text-white text-xs font-bold">{Math.round((row.w/tot)*100)}%</span>}
                          </div>
                          <div className="bg-yellow-400 h-full transition-all" style={{width:`${(row.d/tot)*100}%`}}/>
                          <div className="bg-red-500 h-full transition-all flex items-center justify-center" style={{width:`${(row.l/tot)*100}%`}}>
                            {row.l > 0 && <span className="text-white text-xs font-bold">{Math.round((row.l/tot)*100)}%</span>}
                          </div>
                        </>}
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-5 text-xs text-gray-400 mt-4">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"/>Fitore</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block"/>Barazim</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"/>Humbje</span>
                </div>
              </div>

              {/* Extra stat list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-[#1E6FF2]"/>Të Dhëna Shtesë</h3>
                <div className="space-y-3">
                  {[
                    {label:'Mesatare Gola Shënuar', val:stats.avgGf, max:5, color:'bg-green-500'},
                    {label:'Mesatare Gola Pësuar', val:stats.avgGa, max:5, color:'bg-red-500'},
                    {label:'Clean Sheets', val:stats.cleanSheets, max:Math.max(stats.played,1), color:'bg-blue-500'},
                    {label:'Pa Shënuar', val:stats.failedToScore, max:Math.max(stats.played,1), color:'bg-orange-400'},
                    {label:'Fitore të Mëdha (3+)', val:stats.bigWins, max:Math.max(stats.played,1), color:'bg-purple-500'},
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">{s.label}</span>
                        <span className="text-sm font-bold text-gray-800">{s.val}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{width:`${Math.min((+s.val/s.max)*100,100)}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Matches preview */}
            {finishedMatches.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><Swords className="w-4 h-4 text-[#1E6FF2]"/>Ndeshjet e Fundit</h3>
                  <button onClick={()=>setActiveTab('matches')} className="text-sm text-[#1E6FF2] hover:underline flex items-center gap-1">
                    Të gjitha <ArrowRight className="w-3.5 h-3.5"/>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {finishedMatches.slice(-4).reverse().map(m => <MatchCard key={m.id} match={m} onClick={setSelectedMatch} compact/>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STATS ══ */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                {icon:'⚽',label:'Ndeshje',val:stats.played},
                {icon:'🏆',label:'Fitore',val:stats.w},
                {icon:'🤝',label:'Barazime',val:stats.d},
                {icon:'❌',label:'Humbje',val:stats.l},
                {icon:'🎯',label:'Gola Shënuar',val:stats.gf},
                {icon:'🥅',label:'Gola Pësuar',val:stats.ga},
                {icon:'📊',label:'Diferenca',val:stats.gf-stats.ga},
                {icon:'⭐',label:'Pikë',val:standingRow?.points??0},
                {icon:'📈',label:'Mesatare Shënuar',val:stats.avgGf},
                {icon:'📉',label:'Mesatare Pësuar',val:stats.avgGa},
                {icon:'🛡️',label:'Clean Sheets',val:stats.cleanSheets},
                {icon:'💥',label:'Fitore të Mëdha',val:stats.bigWins},
                {icon:'🚫',label:'Pa Shënuar',val:stats.failedToScore},
                {icon:'🏠',label:'Fitore Shtëpi',val:stats.homeW},
                {icon:'✈️',label:'Fitore Jashtë',val:stats.awayW},
                {icon:'📍',label:'Pozita',val:position||'-'},
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="text-2xl font-black text-[#0A1E3C]">{s.val}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">Gola Shënuar / Pësuar (8 ndeshjet e fundit)</h3>
              {areaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={areaData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                    <XAxis dataKey="name" tick={{fontSize:12}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:12}} axisLine={false} tickLine={false} allowDecimals={false}/>
                    <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}/>
                    <Bar dataKey="shenuar" fill="#22c55e" name="Shënuar" radius={[6,6,0,0]}/>
                    <Bar dataKey="pesuar" fill="#ef4444" name="Pësuar" radius={[6,6,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-8">Nuk ka të dhëna.</p>}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-3">Ballafaqim me Skuadër Tjetër</h3>
              <Link to={`/head-to-head?teamA=${id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E6FF2] text-white rounded-xl font-medium hover:bg-[#1558CC] transition-colors">
                <Swords className="w-4 h-4"/>Krahaso me skuadër tjetër
              </Link>
            </div>
          </div>
        )}

        {/* ══ MATCHES ══ */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {finishedMatches.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Ndeshjet e Luajtura ({finishedMatches.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {finishedMatches.slice().reverse().map(m => <MatchCard key={m.id} match={m} onClick={setSelectedMatch} compact/>)}
                </div>
              </div>
            )}
            {upcomingMatches.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Ndeshjet e Ardhshme ({upcomingMatches.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {upcomingMatches.map(m => <MatchCard key={m.id} match={m} onClick={setSelectedMatch} compact/>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ PLAYERS ══ */}
        {activeTab === 'players' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E6FF2]"/>Skuadra ({teamPlayers.length} lojtarë)
            </h3>
            {teamPlayers.length === 0
              ? <p className="text-gray-400 text-sm">Nuk ka lojtarë të regjistruar.</p>
              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {teamPlayers.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#1E6FF2]/40 hover:bg-blue-50/40 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.photo
                          ? <img src={p.photo} alt="" className="w-full h-full object-cover"/>
                          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-black">{p.firstName.charAt(0)}{p.lastName.charAt(0)}</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#1E6FF2] transition-colors">{p.firstName} {p.lastName}</p>
                        {p.position && <span className="text-xs bg-[#1E6FF2]/10 text-[#1E6FF2] px-2 py-0.5 rounded-full font-medium">{p.position}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>

      <Footer/>
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)}/>
    </div>
  );
};

const KpiCard: React.FC<{icon:React.ReactNode;label:string;value:string|number;sub:string;trend:'up'|'down'|'neutral';color:string}> = ({icon,label,value,sub,trend,color}) => {
  const colors: Record<string,string> = {
    green:'bg-green-50 text-green-600 border-green-100',
    blue:'bg-blue-50 text-blue-600 border-blue-100',
    purple:'bg-purple-50 text-purple-600 border-purple-100',
    yellow:'bg-yellow-50 text-yellow-600 border-yellow-100',
  };
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${colors[color]?.split(' ').slice(2).join(' ')||'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]?.split(' ').slice(0,2).join(' ')}`}>{icon}</div>
        {trend==='up' && <ChevronUp className="w-4 h-4 text-green-500"/>}
        {trend==='down' && <ChevronDown className="w-4 h-4 text-red-500"/>}
        {trend==='neutral' && <Minus className="w-4 h-4 text-gray-400"/>}
      </div>
      <p className="text-3xl font-black text-[#0A1E3C]">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
};

export default TeamProfilePage;
