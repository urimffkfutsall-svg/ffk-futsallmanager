import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndividualStatsPage: React.FC = () => {
  const { players, teams, competitions, playerDiscipline, getActiveSeason } = useData();
  const [selectedComp, setSelectedComp] = useState<'all' | 'superliga' | 'liga_pare'>('all');
  const [sortBy, setSortBy] = useState<'yellows' | 'reds' | 'notes'>('yellows');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const season = getActiveSeason();

  const records = playerDiscipline || [];

  const allWeeks = useMemo(() => {
    const ws = [...new Set(records.map(d => d.week))].sort((a, b) => a - b);
    return ws;
  }, [records]);

  const filteredPlayers = useMemo(() => {
    let teamIds: string[] = [];
    if (selectedComp !== 'all') {
      const compTeams = teams.filter(t => {
        const c = competitions.find(cc => cc.id === t.competitionId);
        return c?.type === selectedComp;
      });
      teamIds = compTeams.map(t => t.id);
    }

    const playerMap = new Map<string, { yellows: number; reds: number; notes: number }>();
    records.forEach(d => {
      if (selectedComp !== 'all' && !teamIds.includes(d.teamId)) return;
      if (selectedWeek !== 'all' && d.week !== selectedWeek) return;
      if (!playerMap.has(d.playerId)) playerMap.set(d.playerId, { yellows: 0, reds: 0, notes: 0 });
      const entry = playerMap.get(d.playerId)!;
      if (d.type === 'yellow') entry.yellows++;
      else if (d.type === 'red') entry.reds++;
      else entry.notes++;
    });

    return Array.from(playerMap.entries())
      .map(([pid, stats]) => {
        const player = players.find(p => p.id === pid);
        const team = teams.find(t => t.id === player?.teamId);
        return { player, team, ...stats };
      })
      .filter(x => x.player)
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [records, players, teams, competitions, selectedComp, sortBy, selectedWeek]);

  // Weekly summary
  const weeklySummary = useMemo(() => {
    let teamIds: string[] = [];
    if (selectedComp !== 'all') {
      const compTeams = teams.filter(t => {
        const c = competitions.find(cc => cc.id === t.competitionId);
        return c?.type === selectedComp;
      });
      teamIds = compTeams.map(t => t.id);
    }
    const weekMap = new Map<number, { yellows: number; reds: number; notes: number }>();
    records.forEach(d => {
      if (selectedComp !== 'all' && !teamIds.includes(d.teamId)) return;
      if (!weekMap.has(d.week)) weekMap.set(d.week, { yellows: 0, reds: 0, notes: 0 });
      const entry = weekMap.get(d.week)!;
      if (d.type === 'yellow') entry.yellows++;
      else if (d.type === 'red') entry.reds++;
      else entry.notes++;
    });
    return Array.from(weekMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [records, teams, competitions, selectedComp]);

  const totalYellows = filteredPlayers.reduce((s, x) => s + x.yellows, 0);
  const totalReds = filteredPlayers.reduce((s, x) => s + x.reds, 0);
  const totalNotes = filteredPlayers.reduce((s, x) => s + x.notes, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header/>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/statistikat" className="flex items-center gap-1 text-sm text-[#1E6FF2] mb-4 hover:underline"><ChevronLeft className="w-4 h-4"/>Kthehu te Statistikat</Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Statistikat Individuale</h1>
        <p className="text-sm text-gray-500 mb-6">Kartona të verdhë, të kuq dhe shënime shtesë për lojtarët</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
            <span className="w-6 h-8 bg-yellow-400 rounded-sm inline-block mb-2"/>
            <p className="text-2xl font-black text-yellow-600">{totalYellows}</p>
            <p className="text-xs text-yellow-600 font-medium">Kartona të Verdhë</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <span className="w-6 h-8 bg-red-500 rounded-sm inline-block mb-2"/>
            <p className="text-2xl font-black text-red-600">{totalReds}</p>
            <p className="text-xs text-red-600 font-medium">Kartona të Kuq</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2"/>
            <p className="text-2xl font-black text-blue-600">{totalNotes}</p>
            <p className="text-xs text-blue-600 font-medium">Shënime Shtesë</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setSelectedComp('all')} className={selectedComp === 'all' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>Të Gjitha</button>
            <button onClick={() => setSelectedComp('superliga')} className={selectedComp === 'superliga' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>Superliga</button>
            <button onClick={() => setSelectedComp('liga_pare')} className={selectedComp === 'liga_pare' ? 'px-4 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'px-4 py-2 text-sm font-medium text-gray-500'}>Liga e Parë</button>
          </div>
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setSortBy('yellows')} className={sortBy === 'yellows' ? 'px-3 py-2 text-sm font-bold rounded-lg bg-yellow-400 text-white shadow-sm' : 'px-3 py-2 text-sm font-medium text-gray-500'}>KV</button>
            <button onClick={() => setSortBy('reds')} className={sortBy === 'reds' ? 'px-3 py-2 text-sm font-bold rounded-lg bg-red-500 text-white shadow-sm' : 'px-3 py-2 text-sm font-medium text-gray-500'}>KK</button>
            <button onClick={() => setSortBy('notes')} className={sortBy === 'notes' ? 'px-3 py-2 text-sm font-bold rounded-lg bg-blue-500 text-white shadow-sm' : 'px-3 py-2 text-sm font-medium text-gray-500'}>Shën.</button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400"/>
            <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
              <option value="all">Të gjitha javët</option>
              {allWeeks.map(w => <option key={w} value={w}>Java {w}</option>)}
            </select>
          </div>
        </div>

        {/* Weekly Summary Table */}
        {selectedWeek === 'all' && weeklySummary.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="px-5 py-3 bg-gray-50 text-sm font-bold text-gray-600">Përmbledhje sipas Javeve</div>
            <div className="grid grid-cols-4 gap-3 px-5 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              <span>Java</span><span className="text-center">KV</span><span className="text-center">KK</span><span className="text-center">Shënime</span>
            </div>
            {weeklySummary.map(([week, stats]) => (
              <div key={week} onClick={() => setSelectedWeek(week)} className="grid grid-cols-4 gap-3 px-5 py-2.5 border-t border-gray-50 hover:bg-blue-50 cursor-pointer items-center">
                <span className="text-sm font-semibold text-gray-700">Java {week}</span>
                <div className="flex items-center justify-center gap-1"><span className="w-3 h-4 bg-yellow-400 rounded-sm"/><span className="text-sm font-bold">{stats.yellows}</span></div>
                <div className="flex items-center justify-center gap-1"><span className="w-3 h-4 bg-red-500 rounded-sm"/><span className="text-sm font-bold">{stats.reds}</span></div>
                <div className="flex items-center justify-center gap-1"><FileText className="w-3 h-3 text-blue-500"/><span className="text-sm font-bold">{stats.notes}</span></div>
              </div>
            ))}
          </div>
        )}

        {selectedWeek !== 'all' && (
          <button onClick={() => setSelectedWeek('all')} className="flex items-center gap-1 text-sm text-[#1E6FF2] mb-4 hover:underline"><ChevronLeft className="w-4 h-4"/>Shfaq të gjitha javët</button>
        )}

        {/* Player Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 text-sm font-bold text-gray-600">
            Lojtarët {selectedWeek !== 'all' ? '- Java ' + selectedWeek : ''}
          </div>
          <div className="grid grid-cols-[40px_48px_1fr_auto_70px_70px_70px] gap-3 px-5 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
            <span>#</span><span></span><span>Lojtari</span><span>Skuadra</span>
            <span className="text-center">KV</span><span className="text-center">KK</span><span className="text-center">Shën.</span>
          </div>
          {filteredPlayers.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm">Nuk ka të dhëna.</p>
          ) : filteredPlayers.slice(0, 50).map((item, i) => (
            <div key={item.player!.id} className="grid grid-cols-[40px_48px_1fr_auto_70px_70px_70px] gap-3 px-5 py-3 items-center border-t border-gray-50 hover:bg-gray-50">
              <span className={'text-sm font-bold ' + (i < 3 ? 'text-[#1E6FF2]' : 'text-gray-400')}>{i + 1}</span>
              <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
                {item.player!.photo ? <img src={item.player!.photo} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">{item.player!.firstName.charAt(0)}{item.player!.lastName.charAt(0)}</div>}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.player!.firstName} {item.player!.lastName}</p>
                <p className="text-xs text-gray-400">{item.player!.position || ''}</p>
              </div>
              <span className="text-xs text-gray-500">{item.team?.name || '-'}</span>
              <div className="flex items-center justify-center gap-1">
                <span className="w-4 h-5 bg-yellow-400 rounded-sm inline-block"/><span className="text-sm font-bold">{item.yellows}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-4 h-5 bg-red-500 rounded-sm inline-block"/><span className="text-sm font-bold">{item.reds}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-500"/><span className="text-sm font-bold">{item.notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default IndividualStatsPage;