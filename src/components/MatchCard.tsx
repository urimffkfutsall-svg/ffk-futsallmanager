import React from 'react';
import { Match } from '@/types';
import { useData } from '@/context/DataContext';
import { MapPin, Calendar, Clock } from 'lucide-react';

const formatDate = (d: string) => { const p = d.split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d; };

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

const GLOW = { boxShadow: 'inset 0 0 30px rgba(30,111,242,0.05)' };

interface MatchCardProps {
  match: Match;
  onClick: (match: Match) => void;
  compact?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const { getTeamById, competitions } = useData();
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div onClick={() => onClick(match)} className={getCardClass(isLive)}>
      <div className={getAccentClass(isLive, isFinished)}/>
      <div className="p-5">
        {/* Status & Date */}
        <div className="flex items-center justify-between mb-4">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>LIVE
            </span>
          ) : isFinished ? (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Përfunduar</span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3"/>{match.time || 'TBD'}
            </span>
          )}
          {match.date && <span className="text-xs text-gray-400 font-medium">{formatDate(match.date)}</span>}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between gap-3">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              {homeTeam?.logo ? <img src={homeTeam.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-xl font-black text-gray-300">{homeTeam?.name?.charAt(0)}</span>}
            </div>
            <span className="text-xs font-bold text-[#0A1E3C] text-center truncate w-full">{homeTeam?.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center flex-shrink-0 px-2">
            {isFinished || isLive ? (
              <div className="flex items-center gap-2">
                <span className={getScoreClass(isLive)}>{match.homeScore ?? 0}</span>
                <span className="text-xl text-gray-300 font-light">:</span>
                <span className={getScoreClass(isLive)}>{match.awayScore ?? 0}</span>
              </div>
            ) : (
              <div className="bg-[#0A1E3C]/5 px-4 py-2 rounded-xl">
                <span className="text-lg font-black text-[#0A1E3C]/30">VS</span>
              </div>
            )}
            {match.week && <span className="text-[10px] text-gray-400 mt-1.5 font-semibold">Java {match.week}</span>}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              {awayTeam?.logo ? <img src={awayTeam.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-xl font-black text-gray-300">{awayTeam?.name?.charAt(0)}</span>}
            </div>
            <span className="text-xs font-bold text-[#0A1E3C] text-center truncate w-full">{awayTeam?.name}</span>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="flex items-center justify-center gap-1 mt-4 text-[11px] text-gray-400">
            <MapPin className="w-3 h-3"/><span className="truncate">{match.venue}</span>
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" style={GLOW}/>
    </div>
  );
};

export default MatchCard;