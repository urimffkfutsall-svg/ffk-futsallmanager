import React from 'react';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { Shield, Star, ChevronRight } from 'lucide-react';

const FormacioniJavesSection: React.FC = () => {
  const { weeklyFormations, getTeamById } = useData();
  const sorted = [...(weeklyFormations || [])].sort((a, b) => b.week - a.week);
  const latest = sorted[0];
  if (!latest) return null;

  const goalkeeper = latest.players.find(p => p.position === 'goalkeeper');
  const fieldPlayers = latest.players.filter(p => p.position === 'field').sort((a, b) => a.positionIndex - b.positionIndex);
  const rows = [fieldPlayers.slice(0, 2), fieldPlayers.slice(2, 4)];

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-yellow-400 rounded-full"/>
            <h2 className="text-2xl font-black text-[#0A1E3C]">Formacioni i Javës</h2>
            <span className="bg-[#1E6FF2]/10 text-[#1E6FF2] text-xs font-bold px-3 py-1 rounded-full">Java {latest.week}</span>
          </div>
          <Link to="/formacioni" className="flex items-center gap-1 text-sm text-[#1E6FF2] hover:underline font-semibold">
            Shiko më shumë <ChevronRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        <div className="relative bg-gradient-to-b from-[#B8892E] to-[#8B6914] rounded-3xl overflow-hidden shadow-xl" style={{minHeight:'420px'}}>
          {/* Pitch lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border-2 border-white/15"/>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15"/>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 h-12 border-2 border-white/15 rounded-b-xl"/>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-12 border-2 border-white/15 rounded-t-xl"/>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between py-6 px-4" style={{minHeight:'420px'}}>
            <div className="flex justify-around w-full max-w-sm mt-1">
              {rows[0].map(p => <MiniPitchPlayer key={p.id} player={p} getTeamById={getTeamById}/>)}
            </div>
            <div className="flex justify-around w-full max-w-sm">
              {rows[1].map(p => <MiniPitchPlayer key={p.id} player={p} getTeamById={getTeamById}/>)}
            </div>
            <div className="flex justify-center w-full mb-1">
              {goalkeeper && <MiniPitchPlayer player={goalkeeper} getTeamById={getTeamById} isGoalkeeper/>}
            </div>
          </div>
        </div>

        {/* Coach */}
        {latest.coach && (() => {
          const coachTeam = getTeamById(latest.coach!.teamId);
          return (
            <div className="mt-4 bg-gradient-to-r from-[#0A1E3C] to-[#1E6FF2] rounded-2xl p-4 flex items-center gap-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0"/>
              <div className="flex-1">
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Trajneri i Javës</p>
                <p className="text-white font-black">{latest.coach!.firstName} {latest.coach!.lastName}</p>
              </div>
              {coachTeam?.logo && <img src={coachTeam.logo} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-white/20"/>}
              {!coachTeam?.logo && coachTeam && <span className="text-blue-200 text-sm">{coachTeam.name}</span>}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

const MiniPitchPlayer: React.FC<{player:any; getTeamById:(id:string)=>any; isGoalkeeper?:boolean}> = ({player, getTeamById, isGoalkeeper}) => {
  const team = getTeamById(player.teamId);
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className={`w-12 h-12 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-[#0A1E3C]/50`}
        style={{border: `3px solid ${isGoalkeeper ? '#facc15' : 'white'}`}}>
        {team?.logo
          ? <img src={team.logo} alt="" className="w-full h-full object-cover"/>
          : <span className="text-white font-black">{player.firstName.charAt(0)}</span>}
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-bold drop-shadow leading-tight">{player.lastName}</p>
        {isGoalkeeper && <span className="text-yellow-300 text-xs font-bold">POR</span>}
      </div>
    </div>
  );
};

export default FormacioniJavesSection;
