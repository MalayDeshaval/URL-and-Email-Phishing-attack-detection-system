import React, { useState } from 'react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', form.username);
        formData.append('password', form.password);
        
        const response = await authApi.login(formData);
        login(response.data.access_token, { username: form.username });
      } else {
        await authApi.register(form);
        setIsLogin(true);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Incorrect username or password. Please try again.");
      } else if (error.response?.status === 400) {
        alert(error.response.data.detail || "Registration failed. Username or email may already be taken.");
      } else {
        alert("Connection error. Please ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-4 bg-cyber-grid">
      <div className="w-full max-w-md space-y-8 glass p-10 rounded-3xl neon-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-50"></div>
        
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-cyber-neon bg-opacity-10 rounded-2xl flex items-center justify-center border border-cyber-neon border-opacity-30">
            <ShieldCheck className="text-cyber-neon" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">PHISHGUARD <span className="text-cyber-neon">AI</span></h2>
          <p className="text-gray-400">{isLogin ? 'Welcome back, Analyst.' : 'Create your security profile.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                className="w-full bg-cyber-bg border border-cyber-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-neon transition-all"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="w-full bg-cyber-bg border border-cyber-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-neon transition-all"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-cyber-bg border border-cyber-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyber-neon transition-all"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-neon text-black font-bold py-4 rounded-xl hover:bg-opacity-80 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'AUTHORIZE ACCESS' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 hover:text-cyber-neon text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
