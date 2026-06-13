"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIG LOCK CORES ---
const SUPABASE_URL = "https://dvqnsqlxmurzymxellnq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cW5zcWx4bXVyenlteGVsbG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjY1NjksImV4cCI6MjA5Njk0MjU2OX0.bQ4ggzhRbGP27rnscGsvCaM-kXaObuhWYo3XkvTG-og";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface TickerData {
  ticker: string;
  price: number;
  rsi: number;
  rvol: string;
  status: string;
  stop: number;
  target: number;
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [watchlist, setWatchlist] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Session Sync Gate
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDbData = async () => {
    try {
      const res = await fetch('/api/matrix');
      const data = await res.json();
      if (data && data.matrix) {
        setWatchlist(data.matrix);
      }
    } catch (e) {
      console.error("Failed to sync matrix parameters", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDbData();
      const interval = setInterval(fetchDbData, 10000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setWatchlist([]);
  };

  if (authLoading) {
    return (
      <div style={{ backgroundColor: '#030303', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8B949E', fontFamily: 'monospace' }}>
        📡 VERIFYING SECURITY PROTOCOLS...
      </div>
    );
  }

  // --- GATED LOGIN INTERFACE ---
  if (!session) {
    return (
      <main style={{ backgroundColor: '#030303', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: '#0D0E11', border: '1px solid #21262D', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '-0.03em' }}>🏛️ SHALIMAR TERMINAL</h1>
            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8B949E', marginTop: '6px' }}>SECURE WHITE-LABEL ENTERPRISE GATEWAY</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8B949E', fontSize: '12px', fontFamily: 'monospace' }}>OPERATOR EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ backgroundColor: '#1F242C', border: '1px solid #30363D', borderRadius: '6px', padding: '10px', color: '#FFF', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#8B949E', fontSize: '12px', fontFamily: 'monospace' }}>ACCESS PASSKEY</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ backgroundColor: '#1F242C', border: '1px solid #30363D', borderRadius: '6px', padding: '10px', color: '#FFF', fontSize: '14px' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#2ECC71', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14px', cursor: 'pointer', marginTop: '12px', fontFamily: 'monospace' }}>
              EXECUTE SECURE AUTHENTICATION
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- TERMINAL DASHBOARD CORE (AUTHENTICATED ONLY) ---
  return (
    <main style={{ backgroundColor: '#030303', minHeight: '100vh', padding: '24px', color: '#F0F6FC', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFF' }}>🏛️ SHALIMAR CAPITAL TERMINAL</h1>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8B949E', margin: '4px 0 0 0' }}>ENTERPRISE TRIPLE-FILTER ALPHA ENGINE</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => { setLoading(true); fetchDbData(); }} style={{ padding: '8px 16px', backgroundColor: '#1F242C', border: '1px solid #30363D', borderRadius: '6px', color: '#FFF', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}>
            {loading ? "⚡ SYNCING..." : "🔄 FORCE REFRESH"}
          </button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#A82828', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}>
            🚪 LOGOUT
          </button>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ maxWidth: '1400px', margin: '80px auto', textAlign: 'center', fontFamily: 'monospace', color: '#8B949E' }}>
          📡 READING LIVE QUANT PORT DATA FLOWS...
        </div>
      ) : (
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {watchlist.map((item) => (
            <div key={item.ticker} style={{ backgroundColor: '#0D0E11', border: '1px solid #21262D', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>{item.ticker}</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', backgroundColor: item.status === 'BUY' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)', color: item.status === 'BUY' ? '#2ECC71' : '#8B949E' }}>
                  {item.status === 'BUY' ? '🟢 BUY' : '⚪ HOLD'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>Live Price</span><strong>${item.price}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>15M RSI</span><span>{item.rsi}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>Rel Volume</span><span>{item.rvol}</span></div>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #21262D', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#F87171' }}>Stop Floor</span><span style={{ color: '#F87171' }}>${item.stop}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#34D399' }}>Profit Target</span><span style={{ color: '#34D399' }}>${item.target}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
