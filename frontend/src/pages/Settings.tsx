import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Moon, Monitor } from 'lucide-react';

const SettingSection = ({ icon: Icon, title, description, children }: any) => (
  <div className="glass p-6 rounded-2xl neon-border">
    <div className="flex items-start justify-between mb-6">
      <div className="flex gap-4">
        <div className="p-3 rounded-xl bg-cyber-neon/10 text-cyber-neon border border-cyber-neon/20 h-fit">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [notifications, setNotifications] = React.useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : { push: true, email: true };
  });
  const [deepScan, setDeepScan] = React.useState(() => {
    const saved = localStorage.getItem('deepScan');
    return saved ? JSON.parse(saved) : true;
  });
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [pwdForm, setPwdForm] = React.useState({ current_password: '', new_password: '', confirm: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  React.useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  React.useEffect(() => {
    localStorage.setItem('deepScan', JSON.stringify(deepScan));
  }, [deepScan]);

  React.useEffect(() => {
    if (notifications.push && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.new_password !== pwdForm.confirm) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { authApi }: any = await import('../services/api');
      await authApi.updatePassword({ 
        current_password: pwdForm.current_password, 
        new_password: pwdForm.new_password 
      });
      setSuccess(true);
      setIsChangingPassword(false);
      setPwdForm({ current_password: '', new_password: '', confirm: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {success && (
        <div className="fixed top-8 right-8 bg-cyber-neon text-black px-6 py-3 rounded-xl font-bold shadow-lg animate-bounce z-50">
          Intelligence Protocols Updated Successfully!
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-cyber-neon" />
          Security Command Center
        </h1>
        <p className="text-gray-400 mt-1">Configure your defense parameters and operational preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingSection 
          icon={User} 
          title="Profile Intelligence" 
          description="Manage your identity within the network."
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-cyber-neon flex items-center justify-center text-black font-black text-xl">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-white font-bold">{user?.username}</p>
                <p className="text-gray-400 text-xs">{user?.email}</p>
              </div>
            </div>
            
            {isChangingPassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4 border-t border-gray-800">
                {error && <p className="text-cyber-danger text-xs">{error}</p>}
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white text-sm outline-none focus:border-cyber-neon"
                  value={pwdForm.current_password}
                  onChange={e => setPwdForm({...pwdForm, current_password: e.target.value})}
                  required
                />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white text-sm outline-none focus:border-cyber-neon"
                  value={pwdForm.new_password}
                  onChange={e => setPwdForm({...pwdForm, new_password: e.target.value})}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white text-sm outline-none focus:border-cyber-neon"
                  value={pwdForm.confirm}
                  onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-cyber-neon text-black font-bold py-2 rounded-lg text-sm">
                    {saving ? 'UPDATING...' : 'CONFIRM UPDATE'}
                  </button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="px-4 py-2 border border-gray-700 text-gray-400 rounded-lg text-sm">CANCEL</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="text-cyber-neon text-sm font-bold hover:underline"
              >
                Update Access Credentials
              </button>
            )}
          </div>
        </SettingSection>

        <SettingSection 
          icon={Shield} 
          title="Scanning Protocols" 
          description="Adjust the sensitivity and depth of AI analysis."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <p className="text-white font-medium">Deep Neural Scan</p>
                <p className="text-gray-400 text-xs">Run secondary analysis on suspicious patterns.</p>
              </div>
              <button 
                onClick={() => setDeepScan(!deepScan)}
                className={`w-12 h-6 rounded-full relative transition-colors ${deepScan ? 'bg-cyber-neon' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${deepScan ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </SettingSection>

        <SettingSection 
          icon={Bell} 
          title="Notification Subsystems" 
          description="Transmission settings for threat alerts."
        >
          <div className="space-y-4">
             <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={notifications.push}
                 onChange={async (e) => {
                   const checked = e.target.checked;
                   if (checked && Notification.permission !== 'granted') {
                     await Notification.requestPermission();
                   }
                   setNotifications({ ...notifications, push: checked });
                 }}
                 className="accent-cyber-neon w-5 h-5 bg-black border-cyber-neon" 
               />
               <span className="text-gray-300">Push Critical Threat Alerts</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer">
               <input 
                 type="checkbox"
                 checked={notifications.email}
                 onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                 className="accent-cyber-neon w-5 h-5" 
               />
               <span className="text-gray-300">Email Analysis Reports</span>
             </label>
          </div>
        </SettingSection>

        <div className="pt-8 border-t border-gray-800 flex justify-end gap-4">
          <button className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">Abort Changes</button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-cyber-neon text-black font-bold hover:bg-opacity-90 transition-all min-w-[160px]"
          >
            {saving ? 'Processing...' : 'Save Protocols'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
