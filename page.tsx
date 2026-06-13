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
    const interval = setInterval(fetchDbData, 15000); // Poll internal API every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ backgroundColor: '#030303', minHeight: '100vh', padding: '32px', color: '#F0F6FC', fontFamily: 'sans-serif' }}>
      
      {/* Header Panel */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 32px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flexGrow: 1 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, color: '#FFFFFF' }}>
            🏛️ SHALIMAR CAPITAL TERMINAL
          </h1>
          <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8B949E', marginTop: '4px', tracking: '0.1em' }}>
            NEXT-GEN MATRIX LAYER • ACTIVE EST SYNC
          </p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchDbData(); }}
          style={{ padding: '8px 16px', backgroundColor: '#1F242C', border: '1px solid #30363D', borderRadius: '8px', color: '#F0F6FC', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer' }}
        >
          {loading ? "⚡ SYNCING..." : "🔄 FORCE REFRESH"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 32px auto', display: 'flex', gap: '16px', borderBottom: '1px solid #1C1E23', paddingBottom: '8px' }}>
        {['calls', 'puts', 'swing', 'wealth'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 4px',
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              border: 'none',
              color: activeTab === tab ? '#2ECC71' : '#8B949E',
              borderBottom: activeTab === tab ? '2px solid #2ECC71' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'calls' ? '🚀 Day Calls' : tab === 'puts' ? '📉 Day Puts' : tab === 'swing' ? '⏳ Swing' : '🏛️ Wealth'}
          </button>
        ))}
      </div>

      {/* Dynamic Grid Matrix */}
      {watchlist.length === 0 ? (
        <div style={{ maxWidth: '1200px', margin: '40px auto', textAlign: 'center', fontFamily: 'monospace', color: '#8B949E' }}>
          {loading ? "📡 INITIALIZING DATA CONNECTIONS..." : "⚠️ DATABASE TABLE EMPTY. RUN QUANT_ENGINE.PY TO INGEST TICKERS."}
        </div>
      ) : (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {watchlist.map((item) => (
            <div 
              key={item.ticker} 
              style={{
                background: 'linear-gradient(145deg, #0D0E11 0%, #060709 100%)',
                border: '1px solid #1C1E23',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0px 8px 32px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#FFFFFF' }}>{item.ticker}</span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: item.status === 'BUY' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(139, 148, 158, 0.1)',
                  color: item.status === 'BUY' ? '#2ECC71' : '#8B949E',
                  border: item.status === 'BUY' ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(139, 148, 158, 0.2)'
                }}>
                  {item.status === 'BUY' ? '🟢 BUY' : '⚪ HOLD'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>Live Price</span><span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>${item.price.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>15M RSI</span><span style={{ color: item.rsi <= 40 ? '#2ECC71' : '#FFFFFF', fontWeight: 'bold' }}>{item.rsi}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8B949E' }}>Rel Volume</span><span style={{ color: '#FFFFFF' }}>{item.rvol}</span></div>
                
                <div style={{ paddingTop: '12px', marginTop: '4px', borderTop: '1px solid #1C1E23', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#FF6B6B' }}>Stop-Loss Floor</span><span style={{ color: '#FF6B6B', fontWeight: 'bold' }}>${item.stop.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span style={{ color: '#2ECC71' }}>Profit Target</span><span style={{ color: '#2ECC71', fontWeight: 'bold' }}>${item.target.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}