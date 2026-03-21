import React, { useState } from 'react';
import { scanApi } from '../services/api';
import { Mail, ShieldAlert, ShieldCheck, Info, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmailScanner = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const deepScan = JSON.parse(localStorage.getItem('deepScan') || 'true');
      const response = await scanApi.scanEmail(text, deepScan);
      setResult(response.data);

      // Trigger notification if configured
      const notifications = JSON.parse(localStorage.getItem('notifications') || '{"push":true}');
      const isDangerous = response.data.result === 'phishing' || response.data.result === 'suspicious';

      if (notifications.push && isDangerous && Notification.permission === 'granted') {
        new Notification(isDangerous ? "⚠️ SECURITY ALERT" : "🚨 CRITICAL THREAT", {
          body: `Social engineering patterns detected in email analysis (${response.data.result}).`,
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Email Content Analyzer</h1>
        <p className="text-gray-400 mt-1">Paste email headers or body content to detect social engineering and phishing attempts using AI.</p>
      </div>

      <div className="glass p-8 rounded-2xl neon-border">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
             <textarea 
              placeholder="Paste email content here..."
              className="w-full h-48 bg-cyber-bg border border-cyber-border rounded-xl py-4 px-4 focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all resize-none text-gray-200"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-neon text-black font-bold px-8 py-4 rounded-xl hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 disabled:bg-opacity-20 disabled:text-gray-500"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> RUN AI INSPECTION</>}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider">{result.result}</h3>
                  <p className="text-gray-400">AI Logic identified potential threats with {result.confidence.toFixed(1)}% certainty</p>
                </div>
              </div>
            </div>

            <div className="bg-cyber-bg bg-opacity-50 p-6 rounded-xl border border-cyber-border">
              <h4 className="text-cyber-neon font-bold mb-2 flex items-center gap-2">
                <Info size={16} />
                AI EXPLANATION
              </h4>
              <p className="text-gray-300 leading-relaxed italic">{result.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailScanner;
