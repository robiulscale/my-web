
import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Play, 
  Pause, 
  ChevronRight, 
  Mail, 
  Github, 
  Linkedin, 
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
  Terminal as TerminalIcon,
  User,
  Image as ImageIcon,
  MessageSquare,
  Menu as MenuIcon,
  X as CloseIcon,
  Music,
  Check,
  Quote,
  Send,
  MessageCircle,
  Settings as SettingsIcon,
  ArrowRight,
  Download,
  LogIn,
  Globe
} from 'lucide-react';
import { IMAGES as DEFAULT_IMAGES, THEME_COLORS as DEFAULT_THEME_COLORS, ROBIUL_DATA as DEFAULT_ROBIUL_DATA, CONTACTS as DEFAULT_CONTACTS, SOCIAL_CONNECTS as DEFAULT_SOCIAL_CONNECTS } from './constants';
import { translations as DEFAULT_TRANSLATIONS } from './translations';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' }
];

// --- ADMIN COMPONENTS ---

const AdminLogin: React.FC<{ onLogin: () => void, onClose: () => void, isDarkMode: boolean }> = ({ onLogin, onClose, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[300] ${isDarkMode ? 'bg-black/90' : 'bg-slate-900/80'} backdrop-blur-md flex items-center justify-center p-4`}>
      <div className={`${isDarkMode ? 'bg-[#1a1d21] border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-8 w-full max-w-md shadow-2xl relative`}>
        <button 
          onClick={onClose}
          className={`${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'} absolute top-4 right-4 transition-colors`}
        >
          <CloseIcon size={20} />
        </button>
        <h2 
          className={`text-2xl font-bold mb-6 flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
          onClick={onClose}
        >
          <TerminalIcon className="text-green-500" /> Admin Access
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              placeholder="admin@robiul.com"
              required
            />
          </div>
          <div>
            <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ 
  siteData: any, 
  onSave: (data: any) => void, 
  onClose: () => void, 
  isDarkMode: boolean,
  setIsAdminLoggedIn: (val: boolean) => void,
  setIsAdminMode: (val: boolean) => void
}> = ({ siteData, onSave, onClose, isDarkMode, setIsAdminLoggedIn, setIsAdminMode }) => {
  const [data, setData] = useState(siteData);
  const [activeTab, setActiveTab] = useState<'translations' | 'images' | 'theme' | 'social' | 'profile' | 'raw'>('translations');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [isSaving, setIsSaving] = useState(false);

  // Real-time preview: update parent state when local data changes
  useEffect(() => {
    onSave(data);
  }, [data, onSave]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert('Changes saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateTranslation = (lang: string, section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [section]: {
            ...prev.translations[lang][section],
            [field]: value
          }
        }
      }
    }));
  };

  const updateNestedTranslation = (lang: string, section: string, subSection: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [section]: {
            ...prev.translations[lang][section],
            [subSection]: {
              ...prev.translations[lang][section][subSection],
              [field]: value
            }
          }
        }
      }
    }));
  };

  const updateList = (path: string[], index: number, field: string | null, value: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
      }
      if (field) {
        current[index][field] = value;
      } else {
        current[index] = value;
      }
      return newData;
    });
  };

  const addToList = (path: string[], defaultValue: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
      }
      current.push(defaultValue);
      return newData;
    });
  };

  const removeFromList = (path: string[], index: number) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length; i++) {
        current = current[path[i]];
      }
      current.splice(index, 1);
      return newData;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string[], index?: number, field?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (index !== undefined) {
        updateList(path, index, field || null, base64String);
      } else {
        setData((prev: any) => {
          const newData = JSON.parse(JSON.stringify(prev));
          let current = newData;
          for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
          }
          current[path[path.length - 1]] = base64String;
          return newData;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadConfig = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languages = Object.keys(data.translations);
  const isVercel = typeof window !== 'undefined' && (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('run.app'));

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAdminLoggedIn(false);
      setIsAdminMode(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className={`fixed inset-0 z-[300] ${isDarkMode ? 'bg-black/95' : 'bg-slate-50/95'} backdrop-blur-xl flex flex-col transition-colors duration-500`}>
      <header className={`border-b p-4 flex items-center justify-between ${isDarkMode ? 'bg-[#1a1d21] border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <h2 
            className={`text-xl font-bold flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            onClick={onClose}
          >
            <TerminalIcon className="text-green-500" /> Admin Dashboard
          </h2>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {(['translations', 'images', 'theme', 'social', 'profile', 'raw'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900') : (isDarkMode ? 'text-white/40 hover:text-white/60' : 'text-slate-500 hover:text-slate-700')}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}>
            Logout
          </button>
          <button onClick={downloadConfig} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDarkMode ? 'bg-white/5 text-white/60 hover:text-white border border-white/10' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'}`} title="Download data.json to update your repository">
            <Download size={14} /> Download Config
          </button>
          <button onClick={onClose} className={`${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900'} px-4 py-2 text-sm`}>Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 text-sm"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {isVercel && (
            <div className={`mb-8 p-4 rounded-xl border flex items-start gap-3 ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' : 'bg-amber-50/10 border-amber-200 text-amber-800'}`}>
              <div className="mt-0.5"><TerminalIcon size={16} /></div>
              <div className="text-xs space-y-1">
                <p className="font-bold">Vercel Deployment Note:</p>
                <p className="opacity-80">Vercel is stateless. Changes saved here are temporary and will be lost after a few minutes or a new deployment. To make permanent changes, use the <b>Download Config</b> button above and update the <b>data.json</b> file in your repository.</p>
              </div>
            </div>
          )}
          {activeTab === 'translations' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar pb-2">
                {languages.map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedLang === lang ? 'bg-green-600 border-green-600 text-white' : (isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-slate-200 text-slate-500')}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="grid gap-12">
                {/* HERO SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Hero Section</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Greeting</label>
                      <input type="text" value={data.translations[selectedLang].hero.greeting} onChange={(e) => updateTranslation(selectedLang, 'hero', 'greeting', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Name</label>
                      <input type="text" value={data.translations[selectedLang].hero.name} onChange={(e) => updateTranslation(selectedLang, 'hero', 'name', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Surname</label>
                      <input type="text" value={data.translations[selectedLang].hero.surname} onChange={(e) => updateTranslation(selectedLang, 'hero', 'surname', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Description</label>
                      <textarea rows={3} value={data.translations[selectedLang].hero.description} onChange={(e) => updateTranslation(selectedLang, 'hero', 'description', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm resize-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                </section>

                {/* QUOTES SECTION */}
                <section className="space-y-4">
                  <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <h3 className="text-lg font-bold text-green-500">Quotes</h3>
                    <button onClick={() => addToList(['translations', selectedLang, 'quotes'], { text: '', author: '' })} className={`text-[10px] px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Add Quote</button>
                  </div>
                  <div className="space-y-4">
                    {data.translations[selectedLang].quotes.map((quote: any, idx: number) => (
                      <div key={idx} className={`p-4 rounded-xl border relative group ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <button onClick={() => removeFromList(['translations', selectedLang, 'quotes'], idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon size={16} /></button>
                        <div className="grid gap-3">
                          <textarea value={quote.text} onChange={(e) => updateList(['translations', selectedLang, 'quotes'], idx, 'text', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm italic ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`} placeholder="Quote text" />
                          <input type="text" value={quote.author} onChange={(e) => updateList(['translations', selectedLang, 'quotes'], idx, 'author', e.target.value)} className={`w-full border rounded-lg px-3 py-1.5 text-xs ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`} placeholder="Author" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ABOUT SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">About Section</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Title</label>
                      <input type="text" value={data.translations[selectedLang].about.title} onChange={(e) => updateTranslation(selectedLang, 'about', 'title', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Terminal Header</label>
                      <input type="text" value={data.translations[selectedLang].about.terminalHeader} onChange={(e) => updateTranslation(selectedLang, 'about', 'terminalHeader', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Rank</label>
                      <input type="text" value={data.translations[selectedLang].about.rank} onChange={(e) => updateTranslation(selectedLang, 'about', 'rank', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Status</label>
                      <input type="text" value={data.translations[selectedLang].about.status} onChange={(e) => updateTranslation(selectedLang, 'about', 'status', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Note</label>
                      <input type="text" value={data.translations[selectedLang].about.note} onChange={(e) => updateTranslation(selectedLang, 'about', 'note', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className={`block text-[10px] font-bold uppercase ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Interest List</label>
                        <button onClick={() => addToList(['translations', selectedLang, 'about', 'interestList'], 'New Interest')} className={`text-[10px] px-2 py-0.5 rounded transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.translations[selectedLang].about.interestList.map((interest: string, idx: number) => (
                          <div key={idx} className={`flex items-center gap-2 border px-2 py-1 rounded group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                            <input type="text" value={interest} onChange={(e) => updateList(['translations', selectedLang, 'about', 'interestList'], idx, null, e.target.value)} className={`bg-transparent border-none text-xs focus:outline-none w-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                            <button onClick={() => removeFromList(['translations', selectedLang, 'about', 'interestList'], idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon size={10} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* NAV SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Navigation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(data.translations[selectedLang].nav).map(key => (
                      <div key={key}>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>{key}</label>
                        <input type="text" value={data.translations[selectedLang].nav[key]} onChange={(e) => updateTranslation(selectedLang, 'nav', key, e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* GALLERY SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Gallery Section</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Title</label>
                      <input type="text" value={data.translations[selectedLang].gallery.title} onChange={(e) => updateTranslation(selectedLang, 'gallery', 'title', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Project View Text</label>
                      <input type="text" value={data.translations[selectedLang].gallery.projectView} onChange={(e) => updateTranslation(selectedLang, 'gallery', 'projectView', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                </section>

                {/* CONNECT SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Connect Section</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Title</label>
                      <input type="text" value={data.translations[selectedLang].connect.title} onChange={(e) => updateTranslation(selectedLang, 'connect', 'title', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Subtitle</label>
                      <input type="text" value={data.translations[selectedLang].connect.subtitle} onChange={(e) => updateTranslation(selectedLang, 'connect', 'subtitle', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className={`md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                      {Object.keys(data.translations[selectedLang].connect.socialSubtitles).map(key => (
                        <div key={key}>
                          <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Subtitle: {key}</label>
                          <input type="text" value={data.translations[selectedLang].connect.socialSubtitles[key]} onChange={(e) => updateNestedTranslation(selectedLang, 'connect', 'socialSubtitles', key, e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-xs ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* MENU SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Menu & UI</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(data.translations[selectedLang].menu).map(key => (
                      <div key={key}>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Menu: {key}</label>
                        <input type="text" value={data.translations[selectedLang].menu[key]} onChange={(e) => updateTranslation(selectedLang, 'menu', key, e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* FOOTER SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Footer</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Rights Text</label>
                      <input type="text" value={data.translations[selectedLang].footer.rights} onChange={(e) => updateTranslation(selectedLang, 'footer', 'rights', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Made With Text</label>
                      <input type="text" value={data.translations[selectedLang].footer.madeWith} onChange={(e) => updateTranslation(selectedLang, 'footer', 'madeWith', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                </section>

                {/* LOADER SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Loader</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Checking Text</label>
                      <input type="text" value={data.translations[selectedLang].loader.checking} onChange={(e) => updateTranslation(selectedLang, 'loader', 'checking', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Ready Text</label>
                      <input type="text" value={data.translations[selectedLang].loader.ready} onChange={(e) => updateTranslation(selectedLang, 'loader', 'ready', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                  </div>
                </section>

                {/* CONTACT SECTION */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-green-500 border-b border-white/10 pb-2">Contact Form</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Title</label>
                      <input type="text" value={data.translations[selectedLang].contact.title} onChange={(e) => updateTranslation(selectedLang, 'contact', 'title', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Description</label>
                      <input type="text" value={data.translations[selectedLang].contact.description} onChange={(e) => updateTranslation(selectedLang, 'contact', 'description', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className={`md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                      {Object.keys(data.translations[selectedLang].contact.form).map(key => (
                        <div key={key}>
                          <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Form: {key}</label>
                          <input type="text" value={data.translations[selectedLang].contact.form[key]} onChange={(e) => updateNestedTranslation(selectedLang, 'contact', 'form', key, e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-xs ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className={`text-lg font-bold border-b pb-2 ${isDarkMode ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>Core Assets</h3>
                <div className="grid gap-6">
                  <div>
                    <label className={`block text-xs font-medium uppercase mb-2 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Profile Image</label>
                    <div className="flex gap-4 items-center">
                      {data.constants.IMAGES.profile && <img src={data.constants.IMAGES.profile} referrerPolicy="no-referrer" className={`w-16 h-16 rounded-full object-cover border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />}
                      <div className="flex-1 space-y-2">
                        <input type="text" value={data.constants.IMAGES.profile} onChange={(e) => setData((prev: any) => ({ ...prev, constants: { ...prev.constants, IMAGES: { ...prev.constants.IMAGES, profile: e.target.value } } }))} placeholder="Image URL" className={`w-full border rounded-lg px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, ['constants', 'IMAGES', 'profile'])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <button className={`w-full py-1.5 rounded-lg text-[10px] font-bold border border-dashed transition-all ${isDarkMode ? 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60' : 'border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}>
                            Click to Upload Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium uppercase mb-2 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Audio URL (Quran)</label>
                    <input type="text" value={data.constants.IMAGES.audio} onChange={(e) => setData((prev: any) => ({ ...prev, constants: { ...prev.constants, IMAGES: { ...prev.constants.IMAGES, audio: e.target.value } } }))} className={`w-full border rounded-lg px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex flex-col">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gallery Images</h3>
                    <p className={`text-[10px] ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Upload images directly or paste URLs. Base64 images are stored in data.json.</p>
                  </div>
                  <button onClick={() => addToList(['constants', 'IMAGES', 'gallery'], '')} className={`text-[10px] px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>Add Image</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.constants.IMAGES.gallery.map((url: string, idx: number) => (
                    <div key={idx} className={`relative group aspect-video rounded-xl overflow-hidden border ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-100'}`}>
                      {url ? (
                        <img src={url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                          <ImageIcon className={isDarkMode ? 'text-white/10' : 'text-slate-200'} size={32} />
                          <span className="text-[10px] text-slate-400 font-medium">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-4 justify-between">
                        <div className="space-y-2">
                          <textarea value={url} onChange={(e) => updateList(['constants', 'IMAGES', 'gallery'], idx, null, e.target.value)} placeholder="Paste Image URL here..." className="w-full bg-white/10 border border-white/10 rounded p-2 text-[10px] text-white resize-none h-16" />
                          <div className="relative">
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, ['constants', 'IMAGES', 'gallery'], idx)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <button className="w-full py-1 rounded bg-white/10 text-[10px] text-white/60 hover:bg-white/20 transition-all border border-white/10">
                              Upload Image
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromList(['constants', 'IMAGES', 'gallery'], idx)} className="bg-red-500 text-white py-1 rounded text-[10px] font-bold">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Theme Colors</h3>
                <button onClick={() => addToList(['constants', 'THEME_COLORS'], { name: 'New Color', color: '#ffffff' })} className={`text-[10px] px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>Add Color</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.constants.THEME_COLORS.map((theme: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-center gap-4 relative group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <button onClick={() => removeFromList(['constants', 'THEME_COLORS'], idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon size={12} /></button>
                    <input type="color" value={theme.color} onChange={(e) => updateList(['constants', 'THEME_COLORS'], idx, 'color', e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
                    <input type="text" value={theme.name} onChange={(e) => updateList(['constants', 'THEME_COLORS'], idx, 'name', e.target.value)} className={`flex-1 bg-transparent border-none font-bold text-sm focus:outline-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Social Connections</h3>
                <button onClick={() => addToList(['constants', 'SOCIAL_CONNECTS'], { platform: 'New', value: '', link: '', subtitle: '' })} className={`text-[10px] px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>Add Social</button>
              </div>
              <div className="grid gap-4">
                {data.constants.SOCIAL_CONNECTS.map((social: any, idx: number) => (
                  <div key={idx} className={`p-6 rounded-2xl border relative group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <button onClick={() => removeFromList(['constants', 'SOCIAL_CONNECTS'], idx)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon size={18} /></button>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Platform</label>
                        <input type="text" value={social.platform} onChange={(e) => updateList(['constants', 'SOCIAL_CONNECTS'], idx, 'platform', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Display Value</label>
                        <input type="text" value={social.value} onChange={(e) => updateList(['constants', 'SOCIAL_CONNECTS'], idx, 'value', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Link URL</label>
                        <input type="text" value={social.link} onChange={(e) => updateList(['constants', 'SOCIAL_CONNECTS'], idx, 'link', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>Subtitle</label>
                        <input type="text" value={social.subtitle} onChange={(e) => updateList(['constants', 'SOCIAL_CONNECTS'], idx, 'subtitle', e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm ${isDarkMode ? 'bg-black/30 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className={`text-lg font-bold border-b pb-2 ${isDarkMode ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>Profile Info</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-medium uppercase mb-2 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Display Name</label>
                    <input type="text" value={data.constants.ROBIUL_DATA.name} onChange={(e) => setData((prev: any) => ({ ...prev, constants: { ...prev.constants, ROBIUL_DATA: { ...prev.constants.ROBIUL_DATA, name: e.target.value } } }))} className={`w-full border rounded-lg px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium uppercase mb-2 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Rank</label>
                    <input type="text" value={data.constants.ROBIUL_DATA.rank} onChange={(e) => setData((prev: any) => ({ ...prev, constants: { ...prev.constants, ROBIUL_DATA: { ...prev.constants.ROBIUL_DATA, rank: e.target.value } } }))} className={`w-full border rounded-lg px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-xs font-medium uppercase mb-2 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Status Message</label>
                    <input type="text" value={data.constants.ROBIUL_DATA.status} onChange={(e) => setData((prev: any) => ({ ...prev, constants: { ...prev.constants, ROBIUL_DATA: { ...prev.constants.ROBIUL_DATA, status: e.target.value } } }))} className={`w-full border rounded-lg px-4 py-2 text-sm ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Interests</h3>
                  <button onClick={() => addToList(['constants', 'ROBIUL_DATA', 'interests'], '')} className={`text-[10px] px-3 py-1 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'}`}>Add Interest</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {data.constants.ROBIUL_DATA.interests.map((interest: string, idx: number) => (
                    <div key={idx} className={`flex items-center gap-2 border px-3 py-1 rounded-full group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                      <input type="text" value={interest} onChange={(e) => updateList(['constants', 'ROBIUL_DATA', 'interests'], idx, null, e.target.value)} className={`bg-transparent border-none text-xs focus:outline-none w-24 ${isDarkMode ? 'text-white' : 'text-slate-700'}`} />
                      <button onClick={() => removeFromList(['constants', 'ROBIUL_DATA', 'interests'], idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon size={12} /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-bold border-b pb-2 ${isDarkMode ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>Raw Data Editor (JSON)</h3>
              <p className={`text-xs italic ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>Warning: Manual editing can break the site if the structure is invalid.</p>
              <textarea 
                rows={25}
                value={JSON.stringify(data, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setData(parsed);
                  } catch (err) {
                    // Invalid JSON, don't update state yet
                  }
                }}
                className={`w-full border rounded-xl p-6 font-mono text-xs leading-relaxed resize-none ${isDarkMode ? 'bg-black/50 border-white/10 text-green-500' : 'bg-slate-50 border-slate-200 text-green-600'}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


// --- MAIN APP ---

const App: React.FC = () => {
  const [siteData, setSiteData] = useState<any>({ 
    translations: DEFAULT_TRANSLATIONS, 
    constants: { 
      IMAGES: DEFAULT_IMAGES, 
      THEME_COLORS: DEFAULT_THEME_COLORS, 
      ROBIUL_DATA: DEFAULT_ROBIUL_DATA, 
      CONTACTS: DEFAULT_CONTACTS, 
      SOCIAL_CONNECTS: DEFAULT_SOCIAL_CONNECTS 
    } 
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [adminTriggerCount, setAdminTriggerCount] = useState(0);

  // Fetch Site Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const result = await res.json();
        if (result) {
          setSiteData(result);
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Check Auth Status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth-check');
        const result = await res.json();
        setIsAdminLoggedIn(result.authenticated);
      } catch (err) {
        setIsAdminLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeColor, setActiveColor] = useState(siteData.constants.THEME_COLORS[1].color); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [language, setLanguage] = useState<any>('en');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const t = siteData.translations[language] || siteData.translations.en;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determine fast, reliable audio source
  const rawAudio = siteData?.constants?.IMAGES?.audio;
  const audioSrc = (!rawAudio || rawAudio.includes("docs.google.com") || rawAudio.includes("drive.google.com"))
    ? "/audio.mp3"
    : rawAudio;

  const QUOTES = t.quotes;

  const IMAGES = siteData.constants.IMAGES;
  const THEME_COLORS = siteData.constants.THEME_COLORS;
  const ROBIUL_DATA = siteData.constants.ROBIUL_DATA;
  const SOCIAL_CONNECTS = siteData.constants.SOCIAL_CONNECTS;
  const CONTACTS = siteData.constants.CONTACTS;

  useEffect(() => {
    if (isMenuOpen || isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSettingsOpen]);

  // Handle Dark/Light Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialization & Greeting
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowGreeting(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);


  // Update Theme Accent Color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', activeColor);
  }, [activeColor]);

  // Active Section Tracking on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
          });
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'X': return <Twitter className="w-4 h-4" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
      case 'GitHub': return <Github className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const handleAdminSave = React.useCallback((data: any) => {
    setSiteData(data);
  }, []);

  const triggerAdmin = () => {
    setAdminTriggerCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminMode(true);
        return 0;
      }
      return next;
    });
  };

  try {
    return (
      <div 
        className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0c10] text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-primary-color/30 text-xs md:text-sm animate-in fade-in duration-1000 hero-gradient`}
        style={{ '--primary-color': activeColor } as React.CSSProperties}
      >
        {isAdminMode && !isAdminLoggedIn && (
          <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} onClose={() => setIsAdminMode(false)} isDarkMode={isDarkMode} />
        )}

        {isAdminMode && isAdminLoggedIn && (
          <AdminDashboard 
            siteData={siteData} 
            onSave={handleAdminSave} 
            onClose={() => setIsAdminMode(false)} 
            isDarkMode={isDarkMode}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            setIsAdminMode={setIsAdminMode}
          />
        )}

        {/* Settings Modal */}
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500 ${isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
          <div className={`relative w-full max-w-[360px] sm:max-w-[400px] ${isDarkMode ? 'bg-[#16181d] border-white/10' : 'bg-white border-black/10'} border rounded-[32px] p-6 sm:p-7 shadow-2xl transform transition-all duration-500 max-h-[90vh] overflow-y-auto ${isSettingsOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: activeColor }}
                >
                  <SettingsIcon size={18} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight uppercase`}>Settings</h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Language & Preferences</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)} 
                className={`p-2 rounded-full ${isDarkMode ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'} transition-all`}
                title="Close"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-400'} uppercase tracking-[0.2em] flex items-center gap-1.5`}>
                    <Globe size={13} className="primary-text" />
                    {t.menu?.language || 'Language'}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full primary-bg/20 primary-text">
                    {LANGUAGES.find(l => l.code === language)?.label || 'English'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button 
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all duration-200 flex items-center justify-between gap-1.5 ${
                          isSelected 
                            ? 'text-white shadow-md font-bold' 
                            : isDarkMode 
                              ? 'bg-[#22252b] text-white/70 border-white/5 hover:text-white hover:bg-[#2a2e36]' 
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                        style={isSelected ? { backgroundColor: activeColor, borderColor: activeColor } : {}}
                      >
                        <span className="truncate">{lang.label}</span>
                        {isSelected && <Check size={13} className="shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className={`${isDarkMode ? 'bg-[#22252b] border-white/5' : 'bg-slate-100 border-black/5'} rounded-2xl p-4 flex items-center justify-between border`}>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.menu?.mode || 'Theme'}</span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                    {isDarkMode ? (t.menu?.dark || 'Dark') : (t.menu?.light || 'Light')} Mode
                  </span>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-slate-800 hover:bg-slate-200 shadow-sm'} flex items-center justify-center transition-all`}
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-400'} uppercase tracking-[0.2em]`}>
                  {t.menu?.color || 'Accent Color'}
                </span>
                <div className="flex flex-wrap gap-3">
                  {siteData?.constants?.THEME_COLORS?.map((theme: any) => (
                    <button
                      key={theme.name}
                      onClick={() => setActiveColor(theme.color)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center relative transition-transform hover:scale-110 shadow-lg ${activeColor === theme.color ? 'ring-2 ring-offset-2 ring-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: theme.color }}
                      title={theme.name}
                    >
                      {activeColor === theme.color && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      
      {/* Top Floating iPhone Glass Rounded Menu Bar */}
      <header className="fixed top-1.5 sm:top-2 md:top-2.5 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 flex justify-center pointer-events-none transition-all duration-500">
        <div className={`w-full max-w-5xl h-14 md:h-16 px-5 sm:px-7 md:px-8 rounded-2xl md:rounded-full ios-glass-nav border flex items-center justify-between pointer-events-auto transition-all duration-500 ${
          isDarkMode 
            ? 'bg-[#0a0c10]/60 border-white/[0.12] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]' 
            : 'bg-white/60 border-white/80 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]'
        }`}>
          
          {/* Brand Logo (Clean Robiul.) */}
          <div 
            className="flex items-center cursor-pointer group select-none" 
            onClick={() => scrollToSection('home')}
          >
            <span className={`text-xl md:text-2xl font-bold font-playfair tracking-tight transition-transform duration-300 group-hover:scale-105 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Robiul<span className="primary-text group-hover:animate-pulse">.</span>
            </span>
          </div>

          {/* Desktop Horizontal Menu Links with Gallery-like hover animation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {[
              { id: 'home', label: t.nav.home },
              { id: 'about', label: t.nav.about },
              { id: 'gallery', label: t.nav.gallery },
              { id: 'contact', label: t.nav.contact }
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`menu-text-animated relative py-2 px-1 text-sm font-semibold tracking-wide cursor-pointer transition-colors duration-200 group flex items-center gap-1 ${
                    isActive 
                      ? 'primary-text font-bold' 
                      : isDarkMode 
                        ? 'text-white/75 hover:text-white hover:primary-text' 
                        : 'text-slate-700 hover:text-slate-950 hover:primary-text'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Underline indicator */}
                  <span 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full primary-bg transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-80'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Toggle Button */}
            <button 
              onClick={toggleAudio}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isPlaying
                  ? 'primary-bg text-white shadow-md'
                  : isDarkMode 
                    ? 'bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10' 
                    : 'bg-black/5 border border-black/10 text-slate-700 hover:text-slate-900 hover:bg-black/10'
              }`}
              title={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isPlaying ? (
                <div className="flex gap-0.5 items-end h-3">
                  {[0.1, 0.4, 0.2].map((delay, i) => (
                    <div 
                      key={i}
                      className="w-0.5 bg-white rounded-full animate-sound-wave" 
                      style={{ animationDelay: `${delay}s`, opacity: 0.95 }}
                    />
                  ))}
                </div>
              ) : (
                <Play size={15} className="ml-0.5" />
              )}
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10' 
                  : 'bg-black/5 border border-black/10 text-slate-700 hover:text-slate-900 hover:bg-black/10'
              }`}
              title="Settings"
            >
              <SettingsIcon size={16} className="hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`p-2 rounded-xl md:hidden transition-all ${
                isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-black/5'
              }`}
              title="Open Menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>

        </div>
      </header>

      {/* Preloaded Background Audio Element */}
      <audio 
        ref={audioRef} 
        src={audioSrc}
        preload="auto"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        }}
      />

      {/* Full-Screen Centered Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 overflow-y-auto ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl transition-opacity duration-700 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
        
        <button 
          onClick={() => setIsMenuOpen(false)}
          className={`fixed top-8 right-8 p-4 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'} transition-all z-[110] hover:rotate-90`}
        >
          <CloseIcon className="w-7 h-7" />
        </button>

        <div className={`relative min-h-full flex flex-col items-center justify-center p-10 transition-all duration-700 transform ${isMenuOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
          <div className="flex flex-col items-center gap-4 mb-8">
            {['Home', 'About', 'Gallery', 'Contact'].map((item, index) => {
              const id = item.toLowerCase();
              const label = t.nav[id as keyof typeof t.nav];
              return (
                <div key={item} className="relative group overflow-hidden">
                  <button 
                    onClick={() => scrollToSection(id)}
                    className={`menu-text-animated text-3xl md:text-5xl font-serif-elegant transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                    style={{ 
                        transitionDelay: `${index * 100}ms`,
                        color: activeSection === id 
                          ? (isDarkMode ? 'white' : '#0f172a') 
                          : (isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.3)')
                    }}
                  >
                    {label}
                  </button>
                  {activeSection === id && (
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full primary-bg shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-8 flex flex-col items-center gap-1 transition-all duration-700 delay-300 transform ${isMenuOpen ? 'translate-y-0 opacity-30 hover:opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Robiul Islam Portfolio</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 pt-20 md:pt-40 pb-12 relative">
          
          <div className="relative w-48 h-48 md:w-[340px] md:h-[340px] group">
             {/* Greeting Bubble */}
             <div className={`absolute -top-6 right-0 px-5 py-2.5 rounded-2xl rounded-bl-none shadow-2xl transition-all duration-700 ease-out z-20 border ${isDarkMode ? 'bg-[#16181d] border-white/10' : 'bg-white border-slate-200'} animate-float-greeting ${showGreeting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`} style={{ animationDelay: '0.5s' }}>
              <span className="text-lg font-[900] primary-text tracking-widest drop-shadow-xl">السلام عليكم</span>
            </div>

            {/* Profile Image with Rotating Multi-color Halo Glow */}
            <div className={`w-full h-full rounded-full overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-slate-200'} relative z-10`}>
              <div className="profile-halo-container">
                  <div className="profile-halo-gradient" style={{ '--primary-color': activeColor } as React.CSSProperties}></div>
              </div>
              {siteData.constants.IMAGES.profile && <img src={siteData.constants.IMAGES.profile} alt="Robiul Islam" referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />}
            </div>
            
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-green-500/5 blur-xl -z-10 animate-pulse"></div>
          </div>

          <div className="flex-1 space-y-3 md:space-y-5 text-center md:text-left">
            {/* Pill badge with "HEY, I AM" - with bold-hover animation like the primary button */}
            <div 
              className="inline-block px-4 py-1.5 rounded-full primary-bg border primary-border shadow-lg transition-all active:scale-95 bold-hover cursor-pointer"
              style={{ boxShadow: `0 8px 24px -6px ${activeColor}70` }}
            >
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-playfair">{t.hero.greeting}</span>
            </div>
            
            <h1 className={`text-4xl md:text-7xl font-playfair leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <span className="font-bold">{t.hero.name}</span> <br className="hidden md:block" /><span className="font-light">{t.hero.surname}</span>
            </h1>
            
            <div className={`text-sm md:text-base max-w-xl md:max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} space-y-3`}>
              {(t.hero.description || '').split('\n\n').map((paragraph: string, idx: number) => {
                const isMotto = paragraph.includes('•') || paragraph.includes('·');
                if (isMotto) {
                  return (
                    <div key={idx} className="pt-1 flex items-center justify-center md:justify-start">
                      <span 
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full primary-bg/10 primary-text font-semibold text-xs md:text-sm tracking-wide border primary-border/30 shadow-sm transition-all active:scale-95 bold-hover cursor-pointer"
                        style={{ boxShadow: `0 4px 18px -4px ${activeColor}40` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full primary-bg animate-pulse"></span>
                        <span>{paragraph}</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="font-light leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              {/* Say Hello button with avatar thumbnail (from red mark to green mark) */}
              <button 
                onClick={() => scrollToSection('contact')}
                className="primary-bg text-white px-5 py-2.5 md:px-7 md:py-3 rounded-full font-black shadow-xl transition-all active:scale-95 bold-hover text-xs md:text-sm inline-flex items-center gap-2.5 group"
                style={{ boxShadow: `0 10px 30px -8px ${activeColor}80` }}
              >
                {siteData?.constants?.IMAGES?.profile ? (
                  <img 
                    src={siteData.constants.IMAGES.profile} 
                    alt="Robiul" 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white/50 group-hover:scale-105 transition-transform shrink-0" 
                  />
                ) : (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0">
                    RI
                  </div>
                )}
                <span>{t.hero.sayHello}</span>
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full border font-bold transition-all active:scale-95 bold-hover text-xs md:text-sm ${isDarkMode ? 'border-white/20 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
              >
                {t.hero.aboutMe}
              </button>
            </div>
          </div>
        </section>

        {/* QUOTES SECTION */}
        <section className="pb-12 pt-12 grid md:grid-cols-3 gap-4">
          {t.quotes.map((quote: any, i: number) => (
            <div 
              key={i} 
              className={`p-6 rounded-[28px] border transition-all duration-500 group transform hover:-translate-y-1 ${isDarkMode ? 'bg-[#121418] border-white/5 hover:border-white/10' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
              <div className="mb-3 opacity-30 group-hover:opacity-100 group-hover:primary-text transition-all">
                <Quote className="w-5 h-5" />
              </div>
              <p className={`text-sm md:text-base font-playfair italic mb-4 leading-relaxed group-hover:primary-text transition-colors ${isDarkMode ? '' : 'text-slate-700'}`}>
                "{quote.text}"
              </p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                — {quote.author}
              </p>
            </div>
          ))}
        </section>

        {/* WHO AM I? SECTION */}
        <section id="about" className="py-20 scroll-mt-20">
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${isDarkMode ? 'to-white/20' : 'to-slate-300'}`}></div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-center">{t.about.title}</h2>
            <div className={`h-[1px] flex-1 bg-gradient-to-l from-transparent ${isDarkMode ? 'to-white/20' : 'to-slate-300'}`}></div>
          </div>

          <div className={`max-w-3xl mx-auto rounded-[16px] overflow-hidden border group/terminal transition-all duration-500 ${isDarkMode ? 'bg-[#1a1b1e] border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' : 'bg-slate-100 border-slate-200 shadow-xl'}`}>
            {/* Terminal Header */}
            <div className={`px-5 py-3 flex items-center justify-between border-b ${isDarkMode ? 'bg-[#2d2e32] border-white/5' : 'bg-slate-200 border-slate-300'}`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className={`text-[10px] font-mono flex items-center gap-2 tracking-wider ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                <span>&gt;_ {t.about.terminalHeader}</span>
              </div>
              <div className="w-8"></div>
            </div>
            
            {/* Terminal Body with Coding Style */}
            <div className={`p-6 sm:p-8 md:p-10 font-mono text-xs sm:text-sm md:text-base leading-relaxed overflow-x-auto transition-all duration-300 group-hover/terminal:font-medium ${isDarkMode ? 'bg-[#121316] text-slate-300' : 'bg-[#fafafa] text-slate-800'}`}>
              <div className="flex">
                <p><span className="text-[#c678dd] font-semibold">const</span> <span className="text-[#e5c07b] font-semibold">robiul</span> = &#123;</p>
              </div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">name</span>: <span className="text-[#98c379]">"Md. Robiul Islam"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">title</span>: <span className="text-[#98c379]">"Aspiring Digital Marketer &amp; AI Enthusiast"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">education</span>: <span className="text-[#98c379]">"B.A. Degree Pass Course, National University of Bangladesh"</span>,</p>
              </div>

              <div className="h-3 md:h-4"></div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">skills</span>: [</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Google Ads"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Digital Marketing"</span></p>
              </div>
              <div className="flex mt-1">
                <p className="pl-6 md:pl-8">],</p>
              </div>

              <div className="h-3 md:h-4"></div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">learning</span>: [</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Artificial Intelligence"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Emerging Technologies"</span></p>
              </div>
              <div className="flex mt-1">
                <p className="pl-6 md:pl-8">],</p>
              </div>

              <div className="h-3 md:h-4"></div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">values</span>: [</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Humanity"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Kindness"</span>,</p>
              </div>
              <div className="flex mt-1">
                <p className="pl-12 md:pl-16"><span className="text-[#98c379]">"Helping Others"</span></p>
              </div>
              <div className="flex mt-1">
                <p className="pl-6 md:pl-8">],</p>
              </div>

              <div className="h-3 md:h-4"></div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">mindset</span>: <span className="text-[#98c379]">"Learn, Grow, and Make a Positive Difference"</span>,</p>
              </div>

              <div className="h-3 md:h-4"></div>

              <div className="flex mt-1">
                <p className="pl-6 md:pl-8"><span className="text-[#61afef]">mission</span>: <span className="text-[#98c379]">"To develop my skills in digital marketing and AI while using my knowledge to help people and make a positive impact on society."</span></p>
              </div>

              <div className="flex mt-1">
                <p>&#125;;</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOME WORK VIEW SECTION */}
        <section id="gallery" className="py-20 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-playfair font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>{t.gallery.title}</h2>
          </div>
          
          <div className="perspective-container max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 px-4 py-6">
            {siteData.constants.IMAGES.gallery.map((img: string, idx: number) => {
              if (!img) return null;
              let rotation = 0;
              let zIndex = 10;
              
              // Apply some variety in rotation for the first few images
              if (idx === 0) rotation = 10;
              else if (idx === 1) rotation = -5;
              else if (idx === 2) rotation = 5;
              else rotation = (idx % 2 === 0) ? 2 : -2;

              return (
                <div 
                  key={idx}
                  className={`gallery-card relative w-full md:w-[280px] max-w-[320px] aspect-square rounded-[20px] overflow-hidden border shadow-xl flex-shrink-0 cursor-pointer ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
                  style={{ 
                    transform: window.innerWidth > 768 ? `rotateY(${rotation}deg)` : 'none',
                    zIndex: zIndex + idx
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  {img && <img src={img} alt={`Work ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-5">
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase">{t.gallery.projectView}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CONNECT WITH ME SECTION */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-3">{t.connect.title}</h2>
            <p className="text-slate-500 font-medium tracking-wide text-xs">{t.connect.subtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {siteData.constants.SOCIAL_CONNECTS.slice(0, 4).map((social: any) => (
                <div key={social.platform} className="group">
                  <a 
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-5 rounded-[20px] flex items-center justify-between transition-all group-hover:-translate-y-1 group-hover:shadow-2xl border ${isDarkMode ? 'bg-[#161b22] border-white/5 hover:bg-[#1c2128]' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-color/5 flex items-center justify-center primary-text group-hover:scale-110 transition-transform">
                        {renderSocialIcon(social.platform)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{social.platform}</h4>
                        <p className={`text-[10px] group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                          {t.connect.socialSubtitles[social.platform.toLowerCase() as keyof typeof t.connect.socialSubtitles]}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-20 group-hover:opacity-100 primary-text transition-colors" />
                  </a>
                </div>
              ))}
            </div>
            
            {siteData.constants.SOCIAL_CONNECTS[4] && (
              <div className="flex justify-center">
                <div className="w-full md:w-1/2 group">
                  <a 
                    href={siteData.constants.SOCIAL_CONNECTS[4].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-5 rounded-[20px] flex items-center justify-between transition-all group-hover:-translate-y-1 group-hover:shadow-2xl border ${isDarkMode ? 'bg-[#161b22] border-white/5 hover:bg-[#1c2128]' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-color/5 flex items-center justify-center primary-text group-hover:scale-110 transition-transform">
                        {renderSocialIcon(siteData.constants.SOCIAL_CONNECTS[4].platform)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{siteData.constants.SOCIAL_CONNECTS[4].platform}</h4>
                        <p className={`text-[10px] group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                          {t.connect.socialSubtitles[siteData.constants.SOCIAL_CONNECTS[4].platform.toLowerCase() as keyof typeof t.connect.socialSubtitles]}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-20 group-hover:opacity-100 primary-text transition-colors" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* GET IN TOUCH SECTION */}
        <section id="contact" className="py-20 scroll-mt-20">
          <div className={`max-w-3xl mx-auto border rounded-[32px] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-[#161b22]/40 border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="absolute -inset-20 primary-bg opacity-[0.02] blur-[100px] rounded-full group-hover:opacity-[0.04] transition-opacity"></div>
            
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 relative z-10">{t.contact.title}</h2>
            <p className={`text-sm md:text-base font-medium mb-10 relative z-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.contact.description}
            </p>
            
            <div className="relative z-10 flex justify-center">
              <a 
                href="https://wa.me/8801862278763"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl border transition-all transform hover:scale-[1.03] hover:shadow-2xl group/btn ${isDarkMode ? 'bg-[#1e252e] border-white/10 hover:bg-[#252d38]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                style={{ boxShadow: `0 10px 40px -10px ${activeColor}40` }}
              >
                <div className="p-2.5 bg-[#25D366]/10 rounded-lg group-hover/btn:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <span className="text-base font-bold tracking-wide">{t.contact.button}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-16 text-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
          <p 
            className="font-mono text-[10px] md:text-xs tracking-widest flex items-center gap-2 cursor-default"
            onClick={triggerAdmin}
          >
            {t.footer.rights.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <p className="text-slate-600 text-[9px] md:text-[10px] flex items-center gap-1">
            {t.footer.madeWith} <span className="text-red-500 animate-pulse">❤️</span>
          </p>
        </div>
      </footer>



      {/* Floating Volume Indicator (if playing) */}
      {isPlaying && (
        <div className="fixed bottom-6 left-6 z-50 primary-bg bg-opacity-10 backdrop-blur-xl px-4 py-3 rounded-full border border-primary-color/20 flex items-center gap-3 animate-bounce shadow-2xl">
          <div className="flex gap-1 items-end h-3">
            <div className="w-0.5 primary-bg rounded-full animate-sound-wave" style={{animationDelay: '0s'}}></div>
            <div className="w-0.5 primary-bg rounded-full animate-sound-wave" style={{animationDelay: '0.2s'}}></div>
            <div className="w-0.5 primary-bg rounded-full animate-sound-wave" style={{animationDelay: '0.1s'}}></div>
            <div className="w-0.5 primary-bg rounded-full animate-sound-wave" style={{animationDelay: '0.3s'}}></div>
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">Quran Recitation</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-3 text-white/60 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Work Preview" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
} catch (e) {
  console.error("Render error:", e);
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      <h1 className="text-2xl text-red-500 mb-4 tracking-widest uppercase">System Critical Error</h1>
      <p className="text-white/60 text-sm mb-8">An unexpected error occurred during system initialization.</p>
      <button 
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
        className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest"
      >
        Reboot System
      </button>
    </div>
  );
}
};

export default App;
