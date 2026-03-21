import React, { useState } from 'react';
import { scanApi } from '../services/api';
import { Globe, ShieldAlert, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const deepScan = JSON.parse(localStorage.getItem('deepScan') || 'true');
      const response = await scanApi.scanUrl(url, deepScan);
      setResult(response.data);
      
      // Trigger notification if configured
      const notifications = JSON.parse(localStorage.getItem('notifications') || '{"push":true}');
      const isDangerous = response.data.result === 'phishing' || response.data.result === 'suspicious';
      
      if (notifications.push && isDangerous && Notification.permission === 'granted') {
        new Notification(isDangerous ? "⚠️ SECURITY ALERT" : "🚨 CRITICAL THREAT", {
          body: `${response.data.result.toUpperCase()} activity detected for: ${url}`,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">URL Threat Intelligence</h1>
        <p className="text-gray-400 mt-1">Submit any URL to analyze for phishing, malicious subdomains, and deceptive patterns.</p>
      </div>

      <div className="glass p-8 rounded-2xl neon-border">
        <form onSubmit={handleScan} className="flex gap-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="https://example.com/login"
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-cyber-neon text-black font-bold px-8 py-4 rounded-xl hover:bg-opacity-80 transition-all flex items-center gap-2 disabled:bg-opacity-20 disabled:text-gray-500"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'ANALYZE'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass p-8 rounded-2xl border-l-8 ${
              result.result === 'phishing' ? 'border-cyber-danger' : 
              result.result === 'suspicious' ? 'border-cyber-alert' : 'border-cyber-primary'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${
                  result.result === 'phishing' ? 'bg-cyber-danger bg-opacity-10 text-cyber-danger' :
                  result.result === 'suspicious' ? 'bg-cyber-alert bg-opacity-10 text-cyber-alert' : 'bg-cyber-primary bg-opacity-10 text-cyber-primary'
                }`}>
                  {result.result === 'phishing' ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider">{result.result}</h3>
                  <p className="text-gray-400">Analysis completed with {result.confidence.toFixed(1)}% confidence</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-gray-500 uppercase">Risk Level</span>
                <div className={`text-xl font-black ${
                  result.result === 'phishing' ? 'text-cyber-danger' : 'text-cyber-primary'
                }`}>
                  {result.result === 'phishing' ? 'CRITICAL' : 'MINIMAL'}
                </div>
              </div>
            </div>

            <div className="bg-cyber-bg bg-opacity-50 p-6 rounded-xl border border-cyber-border mb-6">
              <div className="flex items-start gap-3">
                <Info className="text-cyber-neon mt-1" size={18} />
                <p className="text-gray-200 leading-relaxed italic">{result.explanation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {['Feature Extraction', 'Heuristic Mapping', 'ML Inference', 'Pattern Matching'].map(step => (
                 <div key={step} className="flex items-center gap-2 text-xs text-gray-500">
                   <div className="w-2 h-2 rounded-full bg-cyber-neon shadow-[0_0_5px_#00ff9d]"></div>
                   {step}
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLScanner;
