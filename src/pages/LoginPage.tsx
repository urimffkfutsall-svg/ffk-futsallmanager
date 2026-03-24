import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';
import { Shield, Eye, EyeOff, UserPlus, X } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', username: '', password: '', phone: '', email: '', teamId: '' });
  const [regError, setRegError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, register } = useAuth();
  const { teams, competitions } = useData();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Plotëso të gjitha fushat.'); return; }
    const result = login(username, password);
    if (result.success) navigate('/admin');
    else if (result.pending) setError('Llogaria juaj është në pritje për aprovim.');
    else if (result.deactive) setError('Llogaria juaj është e deaktivizuar ose refuzuar.');
    else setError('Username ose fjalëkalimi janë gabim.');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regForm.firstName || !regForm.lastName || !regForm.username || !regForm.password || !regForm.teamId) {
      setRegError('Plotëso të gjitha fushat e detyrueshme.'); return;
    }
    const result = register({
      username: regForm.username, password: regForm.password, role: 'editor',
      firstName: regForm.firstName, lastName: regForm.lastName,
      phone: regForm.phone, email: regForm.email, teamId: regForm.teamId, status: 'pending'
    });
    if (result.success) {
      setShowSuccess(true);
      setRegForm({ firstName: '', lastName: '', username: '', password: '', phone: '', email: '', teamId: '' });
    } else {
      setRegError(result.error || 'Gabim gjatë regjistrimit.');
    }
  };

  const allTeams = teams || [];
  const superligaTeams = allTeams.filter(t => { const c = competitions.find(cc => cc.id === t.competitionId); return c?.type === 'superliga'; });
  const ligaTeams = allTeams.filter(t => { const c = competitions.find(cc => cc.id === t.competitionId); return c?.type === 'liga_pare'; });

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-[#1E6FF2]/10 rounded-2xl flex items-center justify-center">
              {tab === 'login' ? <Shield className="w-7 h-7 text-[#1E6FF2]"/> : <UserPlus className="w-7 h-7 text-[#1E6FF2]"/>}
            </div>
          </div>

          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button onClick={() => { setTab('login'); setError(''); }} className={tab === 'login' ? 'flex-1 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'flex-1 py-2 text-sm font-medium text-gray-500'}>Hyr</button>
            <button onClick={() => { setTab('register'); setRegError(''); }} className={tab === 'register' ? 'flex-1 py-2 text-sm font-bold rounded-lg bg-white text-[#0A1E3C] shadow-sm' : 'flex-1 py-2 text-sm font-medium text-gray-500'}>Regjistrohu</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none" placeholder="Shkruaj username..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fjalëkalimi</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] focus:border-transparent outline-none pr-10" placeholder="Shkruaj fjalëkalimin..."/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" className="w-full py-2.5 bg-[#1E6FF2] text-white rounded-xl font-medium hover:bg-[#1558CC] transition-colors">Hyr</button>
              <p className="text-center text-sm text-gray-500">Nuk keni llogari? <button type="button" onClick={() => setTab('register')} className="text-[#1E6FF2] font-medium hover:underline">Regjistrohu këtu</button></p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Emri *</label>
                  <input value={regForm.firstName} onChange={e => setRegForm(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="Emri"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mbiemri *</label>
                  <input value={regForm.lastName} onChange={e => setRegForm(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="Mbiemri"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Username *</label>
                <input value={regForm.username} onChange={e => setRegForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="Username"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fjalëkalimi *</label>
                <input type="password" value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="Fjalëkalimi"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nr. Telefonit</label>
                  <input value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="+383..."/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none" placeholder="email@..."/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Skuadra *</label>
                <select value={regForm.teamId} onChange={e => setRegForm(p => ({ ...p, teamId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E6FF2] outline-none bg-white">
                  <option value="">Zgjedh skuadrën...</option>
                  {superligaTeams.length > 0 && <optgroup label="Superliga">{superligaTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>}
                  {ligaTeams.length > 0 && <optgroup label="Liga e Parë">{ligaTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>}
                </select>
              </div>
              {regError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{regError}</p>}
              <button type="submit" className="w-full py-2.5 bg-[#1E6FF2] text-white rounded-xl font-medium hover:bg-[#1558CC] transition-colors">Regjistrohu</button>
              <p className="text-center text-sm text-gray-500">Keni llogari? <button type="button" onClick={() => setTab('login')} className="text-[#1E6FF2] font-medium hover:underline">Kyëuni këtu</button></p>
            </form>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccess(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">&#10003;</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Faleminderit që u regjistruat!</h3>
            <p className="text-sm text-gray-500 mb-4">Ju lutemi prisni aprovimin nga administratori.</p>
            <p className="text-sm text-gray-500">Për informata kontaktoni:<br/><span className="font-bold text-[#0A1E3C]">+383 45 278 279</span></p>
            <button onClick={() => { setShowSuccess(false); setTab('login'); }} className="mt-6 px-6 py-2 bg-[#1E6FF2] text-white rounded-xl text-sm font-medium hover:bg-[#1558CC]">Mbyll</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;