import React, { useEffect, useState } from 'react';
import { scanApi } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await scanApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className="p-8 text-cyber-neon animate-pulse">Initializing Security Core...</div>;

  const chartData = [
    { name: 'Safe', value: stats.safe_detected || 0, color: '#238636' },
    { name: 'Phishing', value: stats.phishing_detected || 0, color: '#da3633' },
    { name: 'Suspicious', value: stats.suspicious_detected || 0, color: '#d29922' },
  ];

  const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="glass p-6 rounded-xl neon-border flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-current/10 ${colorClass}`}>
        <Icon size={32} />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Security Overview</h1>
          <p className="text-gray-400 mt-2">Real-time threat detection analytics and system status.</p>
        </div>
        <div className="flex items-center gap-2 text-cyber-neon bg-cyber-neon/10 px-4 py-2 rounded-full border border-cyber-neon/20">
          <Activity size={16} className="animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-wider">System Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Shield} label="Total Scans" value={stats.total_scans} colorClass="bg-cyber-secondary text-cyber-secondary" />
        <StatCard icon={CheckCircle} label="Safe Verified" value={stats.safe_detected} colorClass="bg-cyber-primary text-cyber-primary" />
        <StatCard icon={AlertTriangle} label="Phishing Detected" value={stats.phishing_detected} colorClass="bg-cyber-danger text-cyber-danger" />
        <StatCard icon={Activity} label="Risk Rating" value={stats.phishing_detected > 0 ? 'HIGH' : 'LOW'} colorClass={stats.phishing_detected > 0 ? "bg-cyber-danger text-cyber-danger" : "bg-cyber-primary text-cyber-primary"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl neon-border">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-cyber-neon" size={20} />
            Threat Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-2xl neon-border">
          <h2 className="text-xl font-bold mb-6">Scan Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="name" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
                />
                <Bar dataKey="value" fill="#1f6feb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
