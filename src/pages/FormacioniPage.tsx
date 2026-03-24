import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import { Star, Trophy } from 'lucide-react';

const FormacioniPage: React.FC = () => {
  const { weeklyFormations, getTeamById } = useData();
  const sorted = [...(weeklyFormations || [])].sort((a, b) => b.week - a.week);
  const latest = sorted[0];

  if (!latest) return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg font-medium">Nuk ka formacion të javës aktualisht.</p>
      </div>
      <Footer />
    </div>
  );

  const goalkeeper = latest.players.find(p => p.position === 'goalkeeper');
  const fieldPlayers = latest.players.filter(p => p.position === 'field').sort((a, b) => a.positionIndex - b.positionIndex);
  const defenders = fieldPlayers.filter(p => p.positionIndex === 0 || p.positionIndex === 1);
  const midfielder = fieldPlayers.find(p => p.positionIndex === 2);
  const forward = fieldPlayers.find(p => p.positionIndex === 3);

  return (
    <div className="min-h-screen bg-[#0A1E3C]">
      <Header />

      <div className="bg-gradient-to-br from-[#0A1E3C] via-[#0d2a52] to-[#0A1E3C] text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-yellow-400"/>
            <h1 className="text-3xl font-black tracking-tight">FORMACIONI I JAVS</h1>
            <Trophy className="w-7 h-7 text-yellow-400"/>
          </div>
          <div className="inline-block bg-yellow-400/20 text-yellow-300 text-sm font-bold px-5 py-1.5 rounded-full border border-yellow-400/30">
            JAVA {latest.week}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 3D Court Container */}
        <div className="relative mb-8" style={STYLE_PERSPECTIVE}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={STYLE_COURT}>
            {/* Court surface with wood texture */}
            <div className="absolute inset-0" style={STYLE_WOOD}/>

            {/* Wood plank lines */}
            <div className="absolute inset-0 pointer-events-none" style={STYLE_PLANKS}/>

            {/* Glossy reflection */}
            <div className="absolute inset-0 pointer-events-none" style={STYLE_GLOSS}/>

            {/* Court border */}
            <div className="absolute inset-3 border-2 border-white/60 rounded-lg pointer-events-none"/>

            {/* Center line */}
            <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/50 pointer-events-none"/>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/50 pointer-events-none"/>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 pointer-events-none"/>

            {/* Goal areas */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-44 h-14 border-2 border-white/40 rounded-b-lg pointer-events-none"/>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-44 h-14 border-2 border-white/40 rounded-t-lg pointer-events-none"/>

            {/* Penalty arcs */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/40 pointer-events-none"/>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/40 pointer-events-none"/>

            {/* Corner arcs */}
            <div className="absolute top-3 left-3 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-full pointer-events-none"/>
            <div className="absolute top-3 right-3 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-full pointer-events-none"/>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-full pointer-events-none"/>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-full pointer-events-none"/>

            {/* Players */}
            <div className="relative z-10 flex flex-col items-center justify-between py-10 px-6" style={STYLE_INNER}>
              <div className="flex justify-center w-full mt-2">
                {forward && <PlayerCard player={forward} getTeamById={getTeamById}/>}
              </div>
              <div className="flex justify-center w-full">
                {midfielder && <PlayerCard player={midfielder} getTeamById={getTeamById}/>}
              </div>
              <div className="flex justify-around w-full max-w-xs">
                {defenders.map(p => <PlayerCard key={p.id} player={p} getTeamById={getTeamById}/>)}
              </div>
              <div className="flex justify-center w-full mb-2">
                {goalkeeper && <PlayerCard player={goalkeeper} getTeamById={getTeamById} isGk/>}
              </div>
            </div>
          </div>

          {/* Shadow under the court */}
          <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/30 blur-xl rounded-full"/>
        </div>

        {/* Coach */}
        {latest.coach && (() => {
          const coachTeam = getTeamById(latest.coach.teamId);
          return (
            <div className="bg-gradient-to-r from-[#1a2d4d] to-[#0d2a52] rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/>
                <h3 className="font-black text-white text-lg">Trajneri i Javës</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-[#0A1E3C] text-lg font-black">{latest.coach.firstName.charAt(0)}{latest.coach.lastName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-black text-xl text-white">{latest.coach.firstName} {latest.coach.lastName}</p>
                  <span className="text-blue-300 text-sm">{coachTeam?.name}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      <Footer />
    </div>
  );
};

const STYLE_PERSPECTIVE = { perspective: '1200px' };
const STYLE_COURT = { minHeight: '580px', transform: 'rotateX(8deg)', transformOrigin: 'center bottom', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' };
const STYLE_WOOD = { background: 'linear-gradient(180deg, #C4873D 0%, #D4A04B 20%, #B8822E 40%, #D4A84B 60%, #C4873D 80%, #A06828 100%)' };
const STYLE_PLANKS = { backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(0,0,0,0.08) 80px, rgba(0,0,0,0.08) 81px)', backgroundSize: '81px 100%' };
const STYLE_GLOSS = { background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.05) 100%)' };
const STYLE_INNER = { minHeight: '580px' };

const PlayerCard: React.FC<{player: any; getTeamById: (id: string) => any; isGk?: boolean}> = ({ player, getTeamById, isGk }) => {
  const team = getTeamById(player.teamId);
  const cardBg = isGk
    ? 'linear-gradient(135deg, #854d0e, #a16207, #ca8a04)'
    : 'linear-gradient(135deg, #0A1E3C, #1E3A5F, #1E6FF2)';
  const borderCol = isGk ? '#eab308' : '#60a5fa';
  const cardStyle = { background: cardBg, border: '2px solid ' + borderCol, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' };

  return (
    <div className="flex flex-col items-center group">
      <div className="rounded-xl px-4 py-2.5 text-center min-w-[90px] transition-transform group-hover:scale-110 group-hover:-translate-y-1" style={cardStyle}>
        <p className="text-white text-sm font-black leading-tight">{player.firstName}</p>
        <p className="text-white text-sm font-black leading-tight">{player.lastName}</p>
        <div className="flex items-center justify-center gap-1 mt-0.5">{team?.logo && <img src={team.logo} alt="" className="w-3.5 h-3.5 rounded-sm object-cover"/>}<p className="text-blue-200 text-[10px] opacity-80">{team?.name || ''}</p></div>
      </div>
    </div>
  );
};

export default FormacioniPage;