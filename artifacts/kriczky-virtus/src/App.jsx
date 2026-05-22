import { useState } from 'react'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      background: '#0A0E14',
      color: '#E8ECF1',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z" fill="none" stroke="#C8A24E" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z" fill="rgba(200,162,78,0.15)"/>
      </svg>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#C8A24E' }}>
        Kriczky Virtus
      </h1>
      <p style={{ color: 'rgba(232,236,241,0.5)', fontSize: '0.9rem' }}>
        Ready for App.jsx — paste your component file to get started.
      </p>
    </div>
  )
}
