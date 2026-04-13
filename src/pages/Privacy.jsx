export default function Privacy() {
  return (
    <div className="hue-card p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <a href="/" className="text-2xl font-bold text-white">hue</a>
      </div>

      <div className="flex flex-col gap-6 text-sm text-gray-400 leading-relaxed">
        <div>
          <h1 className="text-white text-xl font-semibold mb-1">Privacy Policy</h1>
          <p className="text-gray-600 text-xs">Last updated: April 2026</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">What we collect</h2>
          <p>Nothing. Hue has no accounts, no sign-up, and no personal data collection of any kind. We don't collect your name, email, device type, or location.</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">Game data</h2>
          <p>All game state (rooms, players, scores) exists only in server memory and is permanently deleted when a game session ends. Nothing is written to a database.</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">Cookies and storage</h2>
          <p>We do not use cookies or local storage. There is nothing to remember between sessions.</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">Third-party services</h2>
          <p>Hue is hosted on Vercel (frontend) and Render (backend). These services may collect standard server logs (IP addresses, request timestamps) as part of their infrastructure. See <a href="https://vercel.com/legal/privacy-policy" className="text-gray-300 underline" target="_blank">Vercel's privacy policy</a> and <a href="https://render.com/privacy" className="text-gray-300 underline" target="_blank">Render's privacy policy</a>.</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">Children</h2>
          <p>Hue is a general-audience game suitable for all ages. We do not knowingly collect any information from anyone, including children.</p>
        </div>

        <div>
          <h2 className="text-white text-sm font-medium mb-2">Changes</h2>
          <p>If this policy changes, the updated date above will reflect that.</p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-900">
        <p className="text-gray-700 text-xs">hue · playhue.vercel.app</p>
      </div>
    </div>
  )
}