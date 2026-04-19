import { hsbToHex } from './colourConvert'

export async function generateShareCard(roundHistory, totalScores, myName) {
    const canvas = document.createElement('canvas')
    const W = 640
    const ROUND_H = 100
    const HEADER_H = 80
    const SCORES_H = Math.min(Object.keys(totalScores).length * 44 + 40, 300)
    const FOOTER_H = 48
    const H = HEADER_H + (roundHistory.length * ROUND_H) + SCORES_H + FOOTER_H + 32

    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#0d0d0d'
    ctx.fillRect(0, 0, W, H)

    // Header
    ctx.fillStyle = 'white'
    ctx.font = '700 36px -apple-system, sans-serif'
    ctx.fillText('hue', 36, 52)

    ctx.fillStyle = '#4b5563'
    ctx.font = '300 14px -apple-system, sans-serif'
    ctx.fillText('no right or wrong answers', 36, 72)

    let y = HEADER_H + 16

    // Round strips
    for (const round of roundHistory) {
        const avgHex = hsbToHex(round.average.h, round.average.s, round.average.b)

        // Word label
        ctx.fillStyle = '#4b5563'
        ctx.font = '400 12px monospace'
        ctx.fillText(round.word.toUpperCase(), 36, y + 14)

        y += 20

        // Sort submissions by score descending
        const sorted = Object.entries(round.submissions)
            .sort((a, b) => (round.scores[b[0]] ?? 0) - (round.scores[a[0]] ?? 0))

        const stripW = (W - 72) / sorted.length
        const stripH = 60
        const radius = 10

        sorted.forEach(([name, colour], i) => {
            const playerHex = hsbToHex(colour.h, colour.s, colour.b)
            const score = round.scores[name] ?? 0
            const x = 36 + i * stripW
            const isMe = name === myName

            // Player colour (top half)
            ctx.save()
            ctx.beginPath()
            roundedRect(ctx, x, y, stripW - 4, stripH, radius)
            ctx.clip()
            ctx.fillStyle = playerHex
            ctx.fillRect(x, y, stripW - 4, stripH)

            // Diagonal cut to average
            ctx.fillStyle = avgHex
            ctx.beginPath()
            ctx.moveTo(x, y + stripH * 0.55)
            ctx.lineTo(x + stripW - 4, y + stripH * 0.35)
            ctx.lineTo(x + stripW - 4, y + stripH)
            ctx.lineTo(x, y + stripH)
            ctx.closePath()
            ctx.fill()
            ctx.restore()

            // Score text
            ctx.fillStyle = 'rgba(255,255,255,0.95)'
            ctx.font = `600 13px -apple-system, sans-serif`
            ctx.fillText(score, x + 8, y + 18)

            // Name text
            ctx.fillStyle = 'rgba(255,255,255,0.85)'
            ctx.font = `${isMe ? '600' : '400'} 11px -apple-system, sans-serif`
            ctx.fillText(isMe ? `${name} ·` : name, x + 8, y + stripH - 8)
        })

        y += stripH + 12
    }

    y += 8

    // Divider
    ctx.fillStyle = '#161616'
    ctx.fillRect(36, y, W - 72, 1)
    y += 16

    // Final scores header
    ctx.fillStyle = '#4b5563'
    ctx.font = '400 11px monospace'
    ctx.fillText('FINAL SCORES', 36, y + 12)
    y += 28

    // Scores
    const rankSymbols = ['#1', '#2', '#3']
    const sorted = Object.entries(totalScores).sort((a, b) => b[1] - a[1])

    for (const [i, [name, score]] of sorted.entries()) {
        const isMe = name === myName
        const rank = rankSymbols[i] || `#${i + 1}`

        ctx.fillStyle = '#4b5563'
        ctx.font = '400 11px monospace'
        ctx.fillText(rank, 36, y + 16)

        ctx.fillStyle = isMe ? 'white' : '#9ca3af'
        ctx.font = `${isMe ? '600' : '400'} 15px -apple-system, sans-serif`
        ctx.fillText(`${name}${isMe ? ' ·' : ''}`, 68, y + 16)

        ctx.fillStyle = 'white'
        ctx.font = '600 15px monospace'
        const scoreStr = String(score)
        const scoreW = ctx.measureText(scoreStr).width
        ctx.fillText(scoreStr, W - 36 - scoreW, y + 16)

        // Divider
        ctx.fillStyle = '#111'
        ctx.fillRect(36, y + 22, W - 72, 1)

        y += 36
    }

    // Footer
    y += 8
    ctx.fillStyle = '#374151'
    ctx.font = '400 12px -apple-system, sans-serif'
    ctx.fillText('playhue.vercel.app', 36, y + 16)

    ctx.fillStyle = '#374151'
    ctx.font = '400 12px monospace'
    const maxStr = `max ${roundHistory.length * 100} pts`
    const maxW = ctx.measureText(maxStr).width
    ctx.fillText(maxStr, W - 36 - maxW, y + 16)

    // Calculate winner text for share message
    const sortedForWinner = Object.entries(totalScores).sort((a, b) => b[1] - a[1])
    const topScore = sortedForWinner[0]?.[1]
    const winners = sortedForWinner.filter(([, s]) => s === topScore).map(([n]) => n)
    const winnerText = winners.length > 1
        ? `${winners.join(' & ')} read the room best`
        : `${winners[0]} read the room best`

    return { canvas, winnerText }
}

function roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}