import React, { useEffect, useState } from 'react';
import { scanApi } from '../services/api';
import { History as HistoryIcon, ShieldAlert, ShieldCheck, Calendar, ArrowRight, Activity, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<any>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await scanApi.getHistory();
        setScans(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDeleteScan = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this intelligence record?")) return;
    try {
      await scanApi.deleteScan(id);
      setScans(scans.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("EXTREME ACTION: Are you sure you want to PURGE all historical intelligence? This cannot be undone.")) return;
    try {
      await scanApi.clearHistory();
      setScans([]);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-cyber-neon animate-pulse">Retrieving historical records...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-2xl w-full max-h-[90vh] overflow-auto p-8 rounded-3xl neon-border relative shadow-[0_0_50px_rgba(0,255,157,0.1)]"
          >
            <button 
              onClick={() => setSelectedScan(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowRight size={24} className="rotate-180" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className={`p-4 rounded-2xl ${
                selectedScan.result === 'phishing' ? 'bg-cyber-danger/10 text-cyber-danger' : 'bg-cyber-primary/10 text-cyber-primary'
              }`}>
                {selectedScan.result === 'phishing' ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Security Intelligence Report</h2>
                <p className="text-gray-400 text-sm">Record ID: {selectedScan.id.toString().padStart(6, '0')}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-500 uppercase font-black mb-2 tracking-widest">Intelligence Subject</p>
                <p className="text-white font-mono break-all">{selectedScan.target}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-black mb-1 tracking-widest">Verdict</p>
                  <p className={`text-lg font-black uppercase ${
                    selectedScan.result === 'phishing' ? 'text-cyber-danger' : 'text-cyber-primary'
                  }`}>{selectedScan.result}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-black mb-1 tracking-widest">Confidence Score</p>
                  <p className="text-lg text-white font-mono">{selectedScan.confidence.toFixed(1)}%</p>
                </div>
              </div>

              <div className="p-6 bg-cyber-neon/5 border border-cyber-neon/20 rounded-2xl">
                <p className="text-xs text-cyber-neon uppercase font-black mb-3 tracking-widest flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" />
                  AI Deep Analysis
                </p>
                <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedScan.explanation}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedScan(null)}
              className="w-full mt-8 py-4 bg-cyber-neon text-black font-black uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(0,255,157,0.2)]"
            >
              Acknowledge & Close
            </button>
          </motion.div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <HistoryIcon className="text-cyber-neon" />
            Scan Archives
          </h1>
          <p className="text-gray-400 mt-1">Review previously analyzed threats and intelligence reports.</p>
        </div>
        {scans.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-cyber-danger hover:bg-cyber-danger/10 border border-cyber-danger/20 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <Trash2 size={16} />
            Purge Archives
          </button>
        )}
      </div>

      <div className="space-y-4">
        {scans.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl border-dashed">
            <p className="text-gray-500">No records found. Start scanning to build your intelligence archive.</p>
          </div>
        ) : (
          scans.map((scan, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={scan.id}
              className="glass p-6 rounded-xl neon-border hover:bg-gray-800/50 transition-colors flex items-center justify-between group cursor-pointer"
              onClick={() => setSelectedScan(scan)}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`p-3 rounded-full ${
                  scan.result === 'phishing' ? 'bg-cyber-danger/10 text-cyber-danger' : 'bg-cyber-primary/10 text-cyber-primary'
                }`}>
                  {scan.result === 'phishing' ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase py-0.5 px-2 rounded ${
                      scan.type === 'url' ? 'bg-cyber-secondary/20 text-blue-400 border border-blue-400/20' : 'bg-purple-900/20 text-purple-400 border border-purple-400/20'
                    }`}>
                      {scan.type}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-white font-medium truncate max-w-md">{scan.target}</h4>
                </div>
              </div>

              <div className="flex items-center gap-8 px-6 border-l border-white/5">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Confidence</p>
                  <p className="text-white font-mono">{scan.confidence.toFixed(1)}%</p>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Verdict</p>
                  <p className={`font-black uppercase tracking-tighter ${
                    scan.result === 'phishing' ? 'text-cyber-danger' : 'text-cyber-primary'
                  }`}>{scan.result}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDeleteScan(e, scan.id)}
                    className="p-2 text-gray-500 hover:text-cyber-danger hover:bg-cyber-danger/10 rounded-lg transition-all"
                    title="Delete Record"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedScan(scan);
                    }}
                    className="p-2 group-hover:bg-cyber-neon group-hover:text-black rounded-lg transition-all"
                  >
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-black" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
