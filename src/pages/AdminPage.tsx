import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import AdminTeams from './admin/AdminTeams';
import AdminPlayers from './admin/AdminPlayers';
import AdminMatches from './admin/AdminMatches';
import AdminScorers from './admin/AdminScorers';
import AdminPlayerOfWeek from './admin/AdminPlayerOfWeek';
import AdminSettings from './admin/AdminSettings';
import AdminLiveControl from './admin/AdminLiveControl';
import AdminKomisioni from './admin/AdminKomisioni';
import AdminFormacioni from './admin/AdminFormacioni';
import AdminEditors from './admin/AdminUsers';
import AdminTeamStats from './admin/AdminTeamStats';
import { getVisitorStats } from '@/hooks/useVisitorTracker';
import { LayoutDashboard, Users, UserCheck, Swords, Target, Star, Settings, Activity, Zap, Radio, FileText, Shield, Eye, BarChart2 } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, isEditor, currentUser } = useAuth();
  const { matches, teams, players, getActiveSeason, competitions, scorers, playersOfWeek } = useData();
  
  // Default tab: editors go to 'live', admins go to 'dashboard'
  const [activeTab, setActiveTab] = useState(() => {
    if (currentUser?.role === 'editor') return 'live';
    return 'dashboard';
  });

  // Update default tab when user changes
  useEffect(() => {
    if (currentUser?.role === 'editor' && activeTab === 'dashboard') {
      setActiveTab('live');
    }
  }, [currentUser]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isEditor && !isAdmin) return <Navigate to="/editor/team" replace />;

  const activeSeason = getActiveSeason();
  const activeMatches = matches.filter(m => activeSeason ? m.seasonId === activeSeason.id : true);
  const liveMatches = activeMatches.filter(m => m.status === 'live');
  const finishedMatches = activeMatches.filter(m => m.status === 'finished');
  const activeTeams = teams.filter(t => activeSeason ? t.seasonId === activeSeason.id : true);

  const visitorStats = getVisitorStats();

  const tabs = [
    { key: 'live', label: 'LIVE Control', icon: Radio, editorAccess: true, highlight: liveMatches.length > 0 },
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, editorAccess: true },
    { key: 'editors', label: 'Editorët', icon: UserCheck, editorAccess: false },
    { key: 'teamstats', label: 'Skuadrat&Lojtarët Stat.', icon: Zap, editorAccess: false },
    { key: 'teams', label: 'Skuadrat', icon: Users, editorAccess: false },
    { key: 'players', label: 'LojtarÃ«t', icon: UserCheck, editorAccess: false },
    { key: 'matches', label: 'Ndeshjet', icon: Swords, editorAccess: true },
    { key: 'scorers', label: 'GolashÃ«nuesit', icon: Target, editorAccess: false },
    { key: 'pow', label: 'Lojtari JavÃ«s', icon: Star, editorAccess: false },
    { key: 'formacioni', label: 'Formacioni', icon: Shield, editorAccess: false },
    { key: 'komisioni', label: 'Komisioni', icon: FileText, editorAccess: false },
    { key: 'settings', label: 'CilÃ«simet', icon: Settings, editorAccess: false },
  ];

  const visibleTabs = isAdmin ? tabs : tabs.filter(t => t.editorAccess);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500">
              {currentUser?.username} ({isAdmin ? 'Administrator' : 'Editor'})
              {activeSeason && <span className="ml-2 text-[#1E6FF2]">Sezoni: {activeSeason.name}</span>}
            </p>
          </div>
          {liveMatches.length > 0 && activeTab !== 'live' && (
            <button
              onClick={() => setActiveTab('live')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors animate-pulse"
            >
              <span className="w-2 h-2 bg-white rounded-full" />
              {liveMatches.length} LIVE
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isLive = tab.key === 'live' && liveMatches.length > 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? isLive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                      : 'bg-[#1E6FF2] text-white shadow-sm'
                    : isLive
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                {isLive && <span className="w-2 h-2 bg-current rounded-full animate-pulse" />}
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LIVE Control */}
        {activeTab === 'live' && <AdminLiveControl />}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <DashCard label="Skuadra" value={activeTeams.length} color="bg-blue-50 text-blue-600" />
              <DashCard label="Ndeshje" value={activeMatches.length} color="bg-green-50 text-green-600" />
              <DashCard label="LojtarÃ«" value={players.filter(p => activeSeason ? p.seasonId === activeSeason.id : true).length} color="bg-purple-50 text-purple-600" />
              <DashCard label="LIVE" value={liveMatches.length} color="bg-red-50 text-red-600" />
            </div>

          {/* Visitor Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-[#1E6FF2]"/>Vizitorët</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-xs text-blue-500 font-medium">Sot</p><p className="text-2xl font-bold text-blue-600">{visitorStats.today}</p></div>
              <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-xs text-green-500 font-medium">Totali</p><p className="text-2xl font-bold text-green-600">{visitorStats.total}</p></div>
              <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-xs text-purple-500 font-medium">Ditë Aktive</p><p className="text-2xl font-bold text-purple-600">{visitorStats.uniqueDays}</p></div>
              <div className="bg-orange-50 rounded-xl p-3 text-center"><p className="text-xs text-orange-500 font-medium">Mesatarja/Ditë</p><p className="text-2xl font-bold text-orange-600">{visitorStats.uniqueDays > 0 ? Math.round(visitorStats.total / visitorStats.uniqueDays) : 0}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">7 Ditët e Fundit</p>
                <div className="flex items-end gap-1 h-20">{visitorStats.last7.map((d: any, i: number) => { const maxV = Math.max(...visitorStats.last7.map((x: any) => x.visits), 1); return (<div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-[#1E6FF2] rounded-t" style={{height: `${Math.max(4, (d.visits / maxV) * 60)}px`}}/><span className="text-[9px] text-gray-400">{d.label}</span></div>);})}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">Faqet më të vizituara</p>
                <div className="space-y-1">{visitorStats.topPages.slice(0,5).map((p: any, i: number) => (<div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-600 truncate">{p.page}</span><span className="text-xs font-bold text-[#1E6FF2]">{p.count}</span></div>))}</div>
              </div>
            </div>
          </div>

            {liveMatches.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Ndeshjet LIVE
                </h3>
                <div className="space-y-2">
                  {liveMatches.map(m => {
                    const home = teams.find(t => t.id === m.homeTeamId);
                    const away = teams.find(t => t.id === m.awayTeamId);
                    return (
                      <div key={m.id} className="bg-white rounded-lg border border-red-100 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium">{home?.name} {m.homeScore ?? 0} - {m.awayScore ?? 0} {away?.name}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('live')}
                          className="text-xs text-red-600 hover:underline font-medium"
                        >
                          LIVE Control
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Ndeshjet e Fundit</h3>
                {finishedMatches.slice(-5).reverse().map(m => {
                  const home = teams.find(t => t.id === m.homeTeamId);
                  const away = teams.find(t => t.id === m.awayTeamId);
                  return (
                    <div key={m.id} className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                      {home?.name} {m.homeScore} - {m.awayScore} {away?.name}
                      <span className="text-xs text-gray-400 ml-2">J{m.week}</span>
                    </div>
                  );
                })}
                {finishedMatches.length === 0 && <p className="text-gray-400 text-sm">Nuk ka ndeshje tÃ« pÃ«rfunduara.</p>}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Kompeticionet Aktive</h3>
                {competitions.filter(c => activeSeason ? c.seasonId === activeSeason.id : true).map(c => (
                  <div key={c.id} className="text-sm text-gray-600 py-1.5 border-b border-gray-50 last:border-0 flex items-center justify-between">
                    <span>{c.name}</span>
                    <span className="text-xs text-gray-400">{teams.filter(t => t.competitionId === c.id).length} skuadra</span>
                  </div>
                ))}
                {competitions.filter(c => activeSeason ? c.seasonId === activeSeason.id : true).length === 0 && (
                  <p className="text-gray-400 text-sm">Nuk ka kompeticione aktive.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && isAdmin && <AdminTeams />}
        {activeTab === 'players' && isAdmin && <AdminPlayers />}
        {activeTab === 'matches' && <AdminMatches />}
        {activeTab === 'scorers' && isAdmin && <AdminScorers />}
        {activeTab === 'pow' && isAdmin && <AdminPlayerOfWeek />}
        {activeTab === 'editors' && isAdmin && <AdminEditors />}
        {activeTab === 'teamstats' && isAdmin && <AdminTeamStats />}
        {activeTab === 'settings' && isAdmin && <AdminSettings />}
        {activeTab === 'komisioni' && isAdmin && <AdminKomisioni />}
        {activeTab === 'formacioni' && isAdmin && <AdminFormacioni />}
      </div>
    </div>
  );
};

const DashCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className={`rounded-xl p-4 ${color}`}>
    <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminPage;








