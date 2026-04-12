import { useEffect, useRef, useState } from 'react'

function SingleDigit({ digit }) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const index = digits.indexOf(digit)

  return (
    <span className="digit-wrapper">
      <span
        className="digit-inner"
        style={{ transform: `translateY(-${index}em)` }}
      >
        {digits.map(d => (
          <span key={d} style={{ height: '1em', display: 'block' }}>{d}</span>
        ))}
      </span>
    </span>
  )
}

export default function ScrollingNumber({ value, className = '' }) {
  const str = String(Math.abs(Math.floor(value)))

  return (
    <span className={`inline-flex ${className}`}>
      {str.split('').map((char, i) => {
        if (char === '.' || char === ':') {
          return <span key={i}>{char}</span>
        }
        return <SingleDigit key={i} digit={char} />
      })}
    </span>
  )
}