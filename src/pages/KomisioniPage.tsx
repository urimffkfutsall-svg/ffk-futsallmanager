import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useData } from '@/context/DataContext';
import { CommissionDecision } from '@/types';
import { FileText, Calendar, Clock, X } from 'lucide-react';

const KomisioniPage: React.FC = () => {
  const { commissionDecisions } = useData();
  const [selected, setSelected] = useState<CommissionDecision | null>(null);

  const byWeek: Record<number, typeof commissionDecisions> = {};
  commissionDecisions.forEach(d => {
    if (!byWeek[d.week]) byWeek[d.week] = [];
    byWeek[d.week].push(d);
  });

  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Header />

      {/* Hero Banner */}
      <div className="bg-[#0A1E3C] text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-8 bg-[#1E6FF2] rounded-full" />
            <h1 className="text-3xl font-extrabold tracking-tight">Komisioni</h1>
          </div>
          <p className="text-gray-400 ml-4 text-sm">Vendimet zyrtare të Komisionit Disiplinor</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {weeks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">Nuk ka vendime të publikuara ende.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {weeks.map(week => {
              const decisions = byWeek[week];
              const weekDate = decisions[0]?.date;
              return (
                <div key={week}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-[#1E6FF2] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow">
                      <Clock className="w-3.5 h-3.5" />
                      Java {week}
                    </div>
                    {weekDate && (
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {weekDate}
                      </span>
                    )}
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decisions.map((d, idx) => (
                      <div
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
                      >
                        <div className="h-1 bg-gradient-to-r from-[#1E6FF2] to-[#0A1E3C]" />
                        <div className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#1E6FF2]/10 rounded-lg flex items-center justify-center">
                              <span className="text-[#1E6FF2] text-xs font-extrabold">{idx + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug group-hover:text-[#1E6FF2] transition-colors">
                                {d.title}
                              </h3>
                              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
                                {d.content}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
                            <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">Vendim zyrtar</span>
                            <div className="flex-1 h-px bg-gray-50" />
                            <span className="text-xs bg-[#1E6FF2]/10 text-[#1E6FF2] font-bold px-2 py-0.5 rounded-full">
                              Java {week}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Top Accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#1E6FF2] to-[#0A1E3C]" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#1E6FF2] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Java {selected.week}
                  </span>
                  {selected.date && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {selected.date}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Largo
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-[#0A1E3C] mb-3 leading-snug">
                {selected.title}
              </h2>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-4" />

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </p>

              {/* Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <X className="w-4 h-4" />
                  Largo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default KomisioniPage;
