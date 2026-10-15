import React, { useState } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  Trash2,
  Calendar,
  Tag,
  Instagram,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { SavedContent, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SavedContentModalProps {
  savedContent: SavedContent[];
  onDeleteContent: (id: string) => Promise<void>;
  language: Language;
}

export const SavedContentModal: React.FC<SavedContentModalProps> = ({
  savedContent,
  onDeleteContent,
  language,
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = savedContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.contentType === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'poster':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>{t.menuSavedContent}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and re-use all previously generated marketing posts, captions, and broadcasts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'marketing', 'instagram', 'whatsapp'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved content by keywords or product name..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid of Saved Content */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center border-dashed">
          <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="font-bold text-white text-base">No saved content found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate and save marketing campaigns, captions, or broadcasts to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.contentType)}
                    <span className="font-bold text-white text-sm truncate max-w-[220px]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.contentType}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-48 overflow-y-auto">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.content, item.id)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? t.copied : t.copyText}</span>
                  </button>
                  <button
                    onClick={() => onDeleteContent(item.id)}
                    title="Delete item"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
