import React from 'react';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { Star, Target } from 'lucide-react';
import Top3Scorers from './Top3Scorers';

const PlayerOfWeekSection: React.FC<{ inline?: boolean }> = ({ inline }) => {
  const { getLatestPlayerOfWeek, getTeamById } = useData();
  const pow = getLatestPlayerOfWeek();
  if (!pow) return null;
  const team = getTeamById(pow.teamId);

  const content = (
    <Link to="/lojtari-javes">
      <div className="relative bg-gradient-to-br from-[#0A1E3C] via-[#0d2a52] to-[#1E6FF2] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
        </div>

        <div className="relative z-10 flex flex-col">
          {/* Photo */}
          <div className="w-full h-56 overflow-hidden">
            {pow.photo
              ? <img src={pow.photo} alt={pow.firstName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
              : <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/20">{pow.firstName.charAt(0)}{pow.lastName.charAt(0)}</div>}
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Lojtari i Jav&#235;s #{pow.week}</span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">{pow.firstName} {pow.lastName}</h3>

            <div className="flex items-center gap-3 mb-3">
              {team?.logo && <img src={team.logo} alt={team?.name} className="w-7 h-7 rounded-lg border-2 border-white/20 object-cover"/>}
              <span className="text-blue-200 font-semibold text-sm">{team?.name}</span>
            </div>

            {pow.isScorer && pow.goalsCount > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-3 py-1.5 w-fit">
                <Target className="w-4 h-4 text-green-400"/>
                <span className="text-white font-bold text-sm">{pow.goalsCount} {pow.goalsCount === 1 ? 'Gol' : 'Gola'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  if (inline) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
          <h2 className="text-2xl font-black text-[#0A1E3C]">Lojtari i Jav&#235;s</h2>
        </div>
        {content}
        <Top3Scorers />
      </div>
    );
  }

  return (
    <section className="py-10 px-4 bg-[#F0F2F5]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
          <h2 className="text-2xl font-black text-[#0A1E3C]">Lojtari i Jav&#235;s</h2>
        </div>
        {content}
        <Top3Scorers />
      </div>
    </section>
  );
};
export default PlayerOfWeekSection;