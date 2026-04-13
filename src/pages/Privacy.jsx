export default function Privacy() {
  return (
    <div className="hue-card" style={{ overflowY: 'auto' }}>
      <div style={{ padding: '32px 28px 24px' }}>
        <a href="/" style={{ color: 'white', fontWeight: 700, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 20 }}>hue</a>

        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Privacy Policy</h1>
        <p style={{ color: '#4b5563', fontSize: 12, marginBottom: 32 }}>Last updated: April 2026</p>

        {[
          ['What we collect', 'Nothing. Hue has no accounts, no sign-up, and no personal data collection of any kind. We don\'t collect your name, email, device type, or location.'],
          ['Game data', 'All game state (rooms, players, scores) exists only in server memory and is permanently deleted when a game session ends. Nothing is written to a database.'],
          ['Cookies and storage', 'We do not use cookies or local storage. There is nothing to remember between sessions.'],
          ['Children', 'Hue is a general-audience game suitable for all ages. We do not knowingly collect any information from anyone, including children.'],
          ['Changes', 'If this policy changes, the updated date above will reflect that.'],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 24 }}>
            <h2 style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</h2>
            <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Third-party services</h2>
          <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>
            Hue is hosted on Vercel (frontend) and Render (backend). These services may collect standard server logs as part of their infrastructure. See{' '}
            <a href="https://vercel.com/legal/privacy-policy" style={{ color: '#d1d5db' }} target="_blank" rel="noreferrer">Vercel's privacy policy</a>{' '}
            and{' '}
            <a href="https://render.com/privacy" style={{ color: '#d1d5db' }} target="_blank" rel="noreferrer">Render's privacy policy</a>.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 20, marginTop: 8 }}>
          <p style={{ color: '#374151', fontSize: 12 }}>hue · playhue.vercel.app</p>
        </div>
      </div>
    </div>
  )
}