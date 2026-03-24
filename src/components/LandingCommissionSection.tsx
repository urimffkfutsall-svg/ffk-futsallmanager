import React from 'react';
import { useData } from '@/context/DataContext';
import { Gavel, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingCommissionSection: React.FC = () => {
  const { commissionDecisions } = useData();
  const visible = commissionDecisions.filter(d => d.showOnLanding).sort((a, b) => b.week - a.week).slice(0, 3);

  if (visible.length === 0) return null;

  return (
    <section className="py-10 px-4 bg-[#F0F2F5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#1E6FF2] rounded-full"/>
            <h2 className="text-2xl font-black text-[#0A1E3C]">Vendimet e Komisionit</h2>
          </div>
          <Link to="/komisioni" className="text-sm font-semibold text-[#1E6FF2] hover:underline">
            Shiko të gjitha →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visible.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#1E6FF2]/10 flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-[#1E6FF2]"/>
                </div>
                <span className="bg-[#0A1E3C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Java {d.week}</span>
                {d.date && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3"/>{d.date}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-[#0A1E3C] mb-2 line-clamp-1">{d.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 whitespace-pre-wrap">{d.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LandingCommissionSection;