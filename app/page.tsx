"use client";

import React, { useState, useEffect } from 'react';

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
  const [activeTab, setActiveTab] = useState('calls');
  const [watchlist, setWatchlist] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDbData = async () => {
    try {
      const res = await fetch('/api/matrix');
      const data = await res.json();
      if (data && data.matrix) {
        setWatchlist(data.matrix);
      }
    } catch (e) {
      console.error("Failed to sync with Supabase pipeline", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
    const interval = setInterval(fetchDbData, 10000); // Fast auto-poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ backgroundColor: '#030303', minHeight: '100vh', padding: '24px', color: '#F0F6FC', fontFamily: 'sans-serif' }}>
      
      {/* Structural Header Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#FFF' }}>
            🏛️ SHALIMAR CAPITAL TERMINAL
          </h1>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8B949E', margin: '4px 0 0 0' }}>
            ENTERPRISE TRIPLE-FILTER ALPHA ENGINE
          </p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchDbData(); }}
          style={{ padding: '8px 16px', backgroundColor: '#1F242C', border: '1px solid #30363D', borderRadius: '6px', color: '#FFF', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
        >
          {loading ? "⚡ SYNCING..." : "🔄 FORCE REFRESH"}
        </button>
      </div>

      {/* Dynamic Grid Layout Builder */}
      {watchlist.length === 0 ? (
        <div style={{ maxWidth: '1400px', margin: '80px auto', textAlign: 'center', fontFamily: 'monospace', color: '#8B949E' }}>
          📡 READING LIVE QUANT PORT DATA FLOWS...
        </div>
      ) : (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {watchlist.map((item) => (
            <div 
              key={item.ticker} 
              style={{
                backgroundColor: '#0D0E11',
                border: '1px solid #21262D',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>{item.ticker}</span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: item.status === 'BUY' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: item.status === 'BUY' ? '#2ECC71' : '#8B949E'
                }}>
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
