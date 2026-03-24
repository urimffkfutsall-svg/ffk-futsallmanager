import React from 'react';
import { Match } from '@/types';
import { useData } from '@/context/DataContext';
import { X, MapPin, Calendar, Clock, User, Trophy } from 'lucide-react';

interface Props {
  match: Match | null;
  onClose: () => void;
}

const getScoreStyle = (isLive: boolean) => ({
  background: isLive ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #0A1E3C, #1E6FF2)',
  boxShadow: isLive ? '0 8px 32px rgba(220,38,38,0.4)' : '0 8px 32px rgba(30,111,242,0.4)',
});

const headerStyle = {
  background: 'linear-gradient(135deg, #f8f8f5 0%, #f0efe8 50%, #e8e7e0 100%)',
};

const modalStyle = {
  boxShadow: '0 25px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
};

const teamLogoStyle = {
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  border: '3px solid rgba(0,0,0,0.08)',
};

const MatchDetailModal: React.FC<Props> = ({ match, onClose }) => {
  const { getTeamById, getGoalsByMatch, players, competitions } = useData();

  if (!match) return null;

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  const goals = getGoalsByMatch(match.id);
  const comp = competitions.find(c => c.id === match.competitionId);
  const homeGoals = goals.filter(g => g.teamId === match.homeTeamId);
  const awayGoals = goals.filter(g => g.teamId === match.awayTeamId);
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  const getPlayerName = (playerId: string) => {
    const p = players.find(pl => pl.id === playerId);
    return p ? p.firstName + ' ' + p.lastName : 'I panjohur';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
      <div className="relative bg-[#FAFAF8] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={modalStyle}>

        {/* Header */}
        <div className="relative p-8 rounded-t-3xl overflow-hidden" style={headerStyle}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-10">
            <X className="w-4 h-4 text-gray-600"/>
          </button>

          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-black/3 pointer-events-none"/>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-black/3 pointer-events-none"/>

          {comp && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#0A1E3C]/10 text-[#0A1E3C] text-xs font-bold px-4 py-1.5 rounded-full border border-[#0A1E3C]/10">
                <Trophy className="w-3 h-3"/>{comp.name} - Java {match.week}
              </span>
            </div>
          )}

          {/* Teams */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden" style={teamLogoStyle}>
                {homeTeam?.logo ? <img src={homeTeam.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-[#0A1E3C] text-2xl font-black">{homeTeam?.name?.charAt(0) || '?'}</span>}
              </div>
              <span className="text-[#0A1E3C] text-sm font-bold mt-3 text-center">{homeTeam?.name || 'TBD'}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-4">
              {isLive && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"/>
                  <span className="text-xs font-black text-red-600 tracking-wider">LIVE</span>
                </div>
              )}
              <div className="rounded-2xl px-6 py-3 flex items-center gap-3" style={getScoreStyle(isLive)}>
                <span className="text-4xl font-black text-white">{match.homeScore ?? '-'}</span>
                <span className="text-2xl text-white/60 font-light">:</span>
                <span className="text-4xl font-black text-white">{match.awayScore ?? '-'}</span>
              </div>
              {match.status === 'planned' && (
                <span className="text-gray-400 text-sm font-bold mt-2">VS</span>
              )}
              {isFinished && (
                <span className="text-emerald-400 text-xs font-bold mt-2 bg-emerald-400/10 px-3 py-1 rounded-full">Përfunduar</span>
              )}
            </div>

            <div className="flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden" style={teamLogoStyle}>
                {awayTeam?.logo ? <img src={awayTeam.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-[#0A1E3C] text-2xl font-black">{awayTeam?.name?.charAt(0) || '?'}</span>}
              </div>
              <span className="text-[#0A1E3C] text-sm font-bold mt-3 text-center">{awayTeam?.name || 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Match Info */}
          <div className="flex flex-wrap gap-3 justify-center">
            {match.date && (
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <Calendar className="w-4 h-4 text-[#1E6FF2]"/>{match.date}
              </span>
            )}
            {match.time && (
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <Clock className="w-4 h-4 text-[#1E6FF2]"/>{match.time}
              </span>
            )}
            {match.venue && (
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                <MapPin className="w-4 h-4 text-[#1E6FF2]"/>{match.venue}
              </span>
            )}
          </div>

          {/* Goals */}
          {goals.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-[#0A1E3C] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"/>Golashënuesit
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  {homeGoals.map(g => (
                    <div key={g.id} className="flex items-center gap-2 text-sm">
                      <span className="text-[#0A1E3C] font-semibold">{getPlayerName(g.playerId)}</span>
                      <span className="text-gray-500 text-xs">{g.minute}'</span>
                      {g.isOwnGoal && <span className="text-red-400 text-[10px] font-bold bg-red-400/10 px-1.5 py-0.5 rounded">(AG)</span>}
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-right">
                  {awayGoals.map(g => (
                    <div key={g.id} className="flex items-center justify-end gap-2 text-sm">
                      <span className="text-gray-500 text-xs">{g.minute}'</span>
                      <span className="text-[#0A1E3C] font-semibold">{getPlayerName(g.playerId)}</span>
                      {g.isOwnGoal && <span className="text-red-400 text-[10px] font-bold bg-red-400/10 px-1.5 py-0.5 rounded">(AG)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {(match.possession_home != null || match.shots_home != null || match.fouls_home != null) && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-[#0A1E3C] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"/>Statistikat
              </h3>
              <div className="space-y-4">
                {match.possession_home != null && <StatBar label="Posedimi" home={match.possession_home} away={match.possession_away ?? 0} suffix="%"/>}
                {match.shots_home != null && <StatBar label="Goditjet" home={match.shots_home} away={match.shots_away ?? 0}/>}
                {match.fouls_home != null && <StatBar label="Faull-et" home={match.fouls_home} away={match.fouls_away ?? 0}/>}
              </div>
            </div>
          )}

          {/* Officials */}
          {(match.referee1 || match.referee2 || match.referee3 || match.delegate) && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-[#0A1E3C] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#1E6FF2] rounded-full"/>Zyrtarrët
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {match.referee1 && <div className="flex items-center gap-2 text-gray-500"><User className="w-3.5 h-3.5 text-gray-400"/>Gjyqtari 1: <span className="text-[#0A1E3C]">{match.referee1}</span></div>}
                {match.referee2 && <div className="flex items-center gap-2 text-gray-500"><User className="w-3.5 h-3.5 text-gray-400"/>Gjyqtari 2: <span className="text-[#0A1E3C]">{match.referee2}</span></div>}
                {match.referee3 && <div className="flex items-center gap-2 text-gray-500"><User className="w-3.5 h-3.5 text-gray-400"/>Gjyqtari 3: <span className="text-[#0A1E3C]">{match.referee3}</span></div>}
                {match.delegate && <div className="flex items-center gap-2 text-gray-500"><User className="w-3.5 h-3.5 text-gray-400"/>Delegati: <span className="text-[#0A1E3C]">{match.delegate}</span></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBar: React.FC<{ label: string; home: number; away: number; suffix?: string }> = ({ label, home, away, suffix }) => {
  const total = home + away || 1;
  const homeWidth = (home / total) * 100;
  const awayWidth = (away / total) * 100;
  const homeBarStyle = { width: homeWidth + '%' };
  const awayBarStyle = { width: awayWidth + '%' };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[#0A1E3C] font-bold text-sm">{home}{suffix}</span>
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-[#0A1E3C] font-bold text-sm">{away}{suffix}</span>
      </div>
      <div className="flex h-2 gap-1 rounded-full overflow-hidden">
        <div className="flex-1 flex justify-end bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E6FF2] to-[#4d8ff7] rounded-full transition-all duration-500" style={homeBarStyle}/>
        </div>
        <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full transition-all duration-500" style={awayBarStyle}/>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;