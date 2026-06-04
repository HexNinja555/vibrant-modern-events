import React, { useState } from 'react';
import { useApp } from '@/store/AppStore';
import { Role } from '@/lib/nightlife';
import { X, Crown } from './icons';

export default function AuthModal() {
  const { authOpen, setAuthOpen, login } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [sent, setSent] = useState(false);

  if (!authOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'reset') { setSent(true); return; }
    if (!email) return;
    try {
      await fetch('https://famous.ai/api/crm/6a21f00107fd5fc041e6ea16/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, source: 'signup', tags: ['nightlife', role] }),
      });
    } catch { /* ignore */ }
    login(name || email.split('@')[0], email, role);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={() => setAuthOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl border border-white/10 bg-[#12121A] p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-2xl font-black text-transparent">
            {mode === 'reset' ? 'Reset Password' : mode === 'login' ? 'Welcome back' : 'Join PULSE'}
          </h2>
          <button onClick={() => setAuthOpen(false)} className="text-white/50"><X className="h-6 w-6" /></button>
        </div>

        {sent ? (
          <div className="py-6 text-center text-white/70">
            <Crown className="mx-auto mb-3 h-10 w-10 text-lime-400" />
            Reset link sent to <span className="text-white">{email}</span>. Check your inbox.
            <button onClick={() => { setSent(false); setMode('login'); }} className="mt-5 w-full rounded-2xl bg-white/10 py-3 font-bold text-white">Back to login</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {mode === 'signup' && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-fuchsia-500" />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-fuchsia-500" />
            {mode !== 'reset' && (
              <input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-fuchsia-500" />
            )}
            {mode === 'signup' && (
              <div className="flex gap-2">
                {(['user', 'manager', 'admin'] as Role[]).map((r) => (
                  <button type="button" key={r} onClick={() => setRole(r)} className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize ${role === r ? 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white' : 'bg-white/5 text-white/50'}`}>{r}</button>
                ))}
              </div>
            )}
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-3.5 font-bold text-white shadow-[0_0_24px_rgba(255,0,110,0.4)]">
              {mode === 'reset' ? 'Send reset link' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>

            {mode !== 'reset' && (
              <>
                <div className="my-2 flex items-center gap-3 text-xs text-white/30"><span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" /></div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => login('Google User', 'google@pulse.app', 'user')} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white">Google</button>
                  <button type="button" onClick={() => login('Apple User', 'apple@pulse.app', 'user')} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white">Apple</button>
                </div>
              </>
            )}

            <div className="flex justify-between pt-2 text-xs text-white/50">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}</button>
              {mode === 'login' && <button type="button" onClick={() => setMode('reset')}>Forgot password?</button>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
