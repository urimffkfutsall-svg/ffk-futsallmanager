import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import MatchDetailModal from './MatchDetailModal';
import { Match } from '@/types';
import { Radio, Clock, CheckCircle, Calendar, MapPin } from 'lucide-react';

const getTabClass = (tab: string, key: string) => {
  const base = 'flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300';
  if (tab !== key) return base + ' bg-white text-gray-500 hover:bg-gray-50 border border-gray-200';
  if (key === 'live') return base + ' bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-200/50 scale-105';
  if (key === 'finished') return base + ' bg-gradient-to-r from-[#0A1E3C] to-[#1a3a6c] text-white shadow-lg shadow-blue-900/30 scale-105';
  return base + ' bg-gradient-to-r from-[#1E6FF2] to-[#4d8ff7] text-white shadow-lg shadow-blue-400/30 scale-105';
};

const getCardClass = (isLive: boolean) => {
  const base = 'relative rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group';
  return isLive ? base + ' border-red-300 shadow-lg shadow-red-100 bg-gradient-to-b from-white to-red-50/30' : base + ' border-gray-100 shadow-md bg-white hover:shadow-blue-100/50';
};

const getAccentClass = (isLive: boolean, isFinished: boolean) => {
  if (isLive) return 'h-1.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500';
  if (isFinished) return 'h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500';
  return 'h-1.5 bg-gradient-to-r from-[#1E6FF2] via-[#4d8ff7] to-[#1E6FF2]';
};

const getScoreClass = (isLive: boolean) => isLive ? 'text-3xl font-black text-red-600' : 'text-3xl font-black text-[#0A1E3C]';
const getBadgeClass = (tab: string, key: string) => tab === key ? 'text-xs px-2 py-0.5 rounded-full font-bold bg-white/20' : 'text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600';

const GLOW = { boxShadow: 'inset 0 0 30px rgba(30,111,242,0.05)' };

const formatDate = (d: string) => { const p = d.split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d; };

const LandingMatches: React.FC = () => {
  const { getFeaturedMatches, teams, competitions } = useData();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [tab, setTab] = useState<'live' | 'finished' | 'upcoming'>('upcoming');

  const featured = getFeaturedMatches();
  const compOrder = (m: Match) => { const c = competitions.find(x => x.id === m.competitionId); if (c?.type === 'superliga') return 0; if (c?.type === 'liga_pare') return 1; return 2; };
  const liveMatches = featured.filter(m => m.status === 'live').sort((a, b) => compOrder(a) - compOrder(b));
  const finishedMatches = featured.filter(m => m.status === 'finished').sort((a, b) => compOrder(a) - compOrder(b) || (b.date || '').localeCompare(a.date || '')).slice(0, 12);
  const upcomingMatches = featured.filter(m => m.status === 'planned').sort((a, b) => compOrder(a) - compOrder(b) || (a.date || '').localeCompare(b.date || '')).slice(0, 12);

  const hasMatches = liveMatches.length > 0 || finishedMatches.length > 0 || upcomingMatches.length > 0;
  if (!hasMatches) return null;
  const activeTab = liveMatches.length > 0 && tab === 'live' ? 'live' : tab;
  const getTeam = (id: string) => teams.find(t => t.id === id);

  const tabs = [
    { key: 'live', label: 'LIVE', icon: <Radio className="w-3.5 h-3.5"/>, count: liveMatches.length },
    { key: 'finished', label: 'Të Luajtura', icon: <CheckCircle className="w-3.5 h-3.5"/>, count: finishedMatches.length },
    { key: 'upcoming', label: 'Të Ardhshme', icon: <Calendar className="w-3.5 h-3.5"/>, count: upcomingMatches.length },
  ];

  const currentMatches = activeTab === 'live' ? liveMatches : activeTab === 'finished' ? finishedMatches : upcomingMatches;

  return (
    <section className="py-10 px-4 bg-[#F0F2F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
            <h2 className="text-2xl font-black text-[#0A1E3C]">Ndeshjet</h2>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={getTabClass(tab, t.key)}>
              {t.key === 'live' && tab === 'live' && <span className="w-2 h-2 bg-white rounded-full animate-pulse"/>}
              {t.icon}
              {t.label}
              {t.count > 0 && <span className={getBadgeClass(tab, t.key)}>{t.count}</span>}
            </button>
          ))}
        </div>

        {currentMatches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-lg">Nuk ka ndeshje në këtë kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentMatches.map(m => {
              const home = getTeam(m.homeTeamId);
              const away = getTeam(m.awayTeamId);
              const isLive = m.status === 'live';
              const isFinished = m.status === 'finished';
              return (
                <div key={m.id} onClick={() => setSelectedMatch(m)} className={getCardClass(isLive)}>
                  <div className={getAccentClass(isLive, isFinished)}/>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      {isLive ? (
                        <span className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>LIVE
                        </span>
                      ) : isFinished ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Përfunduar</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3"/>{m.time || 'TBD'}
                        </span>
                      )}
                      {m.date && <span className="text-xs text-gray-400 font-medium">{formatDate(m.date)}</span>}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          {home?.logo ? <img src={home.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-xl font-black text-gray-300">{home?.name?.charAt(0)}</span>}
                        </div>
                        <span className="text-xs font-bold text-[#0A1E3C] text-center truncate w-full">{home?.name}</span>
                      </div>

                      <div className="flex flex-col items-center flex-shrink-0 px-2">
                        {isFinished || isLive ? (
                          <div className="flex items-center gap-2">
                            <span className={getScoreClass(isLive)}>{m.homeScore ?? 0}</span>
                            <span className="text-xl text-gray-300 font-light">:</span>
                            <span className={getScoreClass(isLive)}>{m.awayScore ?? 0}</span>
                          </div>
                        ) : (
                          <div className="bg-[#0A1E3C]/5 px-4 py-2 rounded-xl">
                            <span className="text-lg font-black text-[#0A1E3C]/30">VS</span>
                          </div>
                        )}
                        {m.week && <span className="text-[10px] text-gray-400 mt-1.5 font-semibold">Java {m.week}</span>}
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          {away?.logo ? <img src={away.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-xl font-black text-gray-300">{away?.name?.charAt(0)}</span>}
                        </div>
                        <span className="text-xs font-bold text-[#0A1E3C] text-center truncate w-full">{away?.name}</span>
                      </div>
                    </div>

                    {m.venue && (
                      <div className="flex items-center justify-center gap-1 mt-4 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3"/><span className="truncate">{m.venue}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" style={GLOW}/>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)}/>
    </section>
  );
};

export default LandingMatches;