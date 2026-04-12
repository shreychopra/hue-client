import { useState } from 'react'

export default function RoomCode({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-gray-400 text-sm">Room code</p>
      <div
        onClick={handleCopy}
        className="flex items-center gap-3 bg-gray-800 rounded-xl px-6 py-3 cursor-pointer hover:bg-gray-700 transition"
      >
        <span className="text-white text-2xl font-mono font-bold tracking-widest">
          {code}
        </span>
        <span className="text-gray-400 text-sm">
          {copied ? '✓ copied' : 'copy'}
        </span>
      </div>
      <p className="text-gray-500 text-xs">share this with friends to join</p>
    </div>
  )
}