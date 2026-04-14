export default function Scoring() {
  return (
    <div className="hue-card" style={{ overflowY: 'auto' }}>
      <div style={{ padding: '32px 28px 28px' }}>

        {/* Header */}
        <a href="/" style={{ color: 'white', fontWeight: 700, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 28 }}>hue</a>

        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>scoring</h1>
        <p style={{ color: '#4b5563', fontSize: 12, margin: '0 0 28px' }}>how points are calculated</p>

        {/* Explanation */}
        <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.7, margin: '0 0 28px' }}>
          each round, the game calculates the group's collective instinct — the average of every colour picked,
          using a circular mean so that colours near red never accidentally average to cyan.
          it then measures how far your colour is from that average using{' '}
          <span style={{ color: '#e5e7eb', fontWeight: 500 }}>CIE76 Delta-E</span> — a colour science standard
          that measures how different two colours actually look to the human eye, not just how different their numbers are.
        </p>

        {/* Example */}
        <p style={{ color: '#4b5563', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
          example — word: "rust"
        </p>

        {/* Swatches */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          {[
            { name: 'A', bg: '#b5451b', score: 91, de: 9 },
            { name: 'B', bg: '#c45e2a', score: 83, de: 18 },
            { name: 'C', bg: '#7a2d10', score: 38, de: 55 },
          ].map(p => (
            <div key={p.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <p style={{ color: '#4b5563', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.name}</p>
              <div style={{
                width: '100%', height: 80, borderRadius: 12, backgroundColor: p.bg,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px 10px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: 16, fontWeight: 600 }}>{p.score}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }}>ΔE {p.de}</span>
              </div>
            </div>
          ))}

          <div style={{ alignSelf: 'center', color: '#374151', fontSize: 16, padding: '18px 2px 0' }}>→</div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <p style={{ color: '#4b5563', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>avg</p>
            <div style={{
              width: '100%', height: 80, borderRadius: 12, backgroundColor: '#be5424',
              border: '1.5px dashed rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace' }}>group</span>
            </div>
          </div>
        </div>

        <p style={{ color: '#4b5563', fontSize: 12, margin: '0 0 28px', lineHeight: 1.5 }}>
          A was closest to the group average — highest score. C diverged most — lowest score.
        </p>

        {/* Sigmoid curve explanation */}
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: '16px 18px', marginBottom: 28 }}>
          <p style={{ color: '#4b5563', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>scoring curve</p>
          <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            scores follow a sigmoid curve — not a flat penalty. small differences from the average cost few points.
            large differences drop off sharply. you always score something for trying.
          </p>
        </div>

        {/* Reference table */}
        <div style={{ borderTop: '1px solid #161616', paddingTop: 20, marginBottom: 24 }}>
          <p style={{ color: '#4b5563', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
            delta-e → points
          </p>
          {[
            ['identical to group average', '100 pts', 'ΔE 0'],
            ['very close', '~91 pts', 'ΔE 10'],
            ['moderately close', '~50 pts', 'ΔE 30'],
            ['quite different', '~22 pts', 'ΔE 60'],
            ['very different', '~8 pts', 'ΔE 100'],
          ].map(([desc, pts, de]) => (
            <div key={desc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #111' }}>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{desc}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#4b5563', fontSize: 11, fontFamily: 'monospace' }}>{de}</span>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600, minWidth: 52, textAlign: 'right' }}>{pts}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #161616', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#374151', fontSize: 12 }}>max 500 pts across 5 rounds</span>
          <a href="/" style={{ color: '#374151', fontSize: 12, textDecoration: 'none' }}>← back</a>
        </div>

      </div>
    </div>
  )
}