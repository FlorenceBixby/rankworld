'use client'
import { useMemo } from 'react'
import TeamSlot from './TeamSlot'
import type { Match, Team } from '@/lib/types'
import { UNIT, BRACKET_HEIGHT, teamTopY, matchupCenterY } from '@/lib/bracket'

interface Props {
  round: number
  matches: Match[]
  side: 'left' | 'right'
  colWidth: number
  onAdvance: (matchIdx: number, winner: Team) => void
  // Previous round matches needed to know if a team was eliminated
  prevMatches?: Match[]
}

const ROUND_LABELS = ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite 8', 'Final Four']

export default function BracketColumn({ round, matches, side, colWidth, onAdvance, prevMatches }: Props) {
  // Build a set of eliminated team ids
  const eliminatedIds = useMemo(() => {
    const ids = new Set<string>()
    matches.forEach(m => {
      if (m.winner) {
        if (m.top && m.top.id !== m.winner.id) ids.add(m.top.id)
        if (m.bottom && m.bottom.id !== m.winner.id) ids.add(m.bottom.id)
      }
    })
    return ids
  }, [matches])

  // Connector lines between this column and the next (right of each slot)
  const connectors = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    const GAP = 24 // px gap between columns where connectors live
    const halfGap = GAP / 2

    matches.forEach((m, j) => {
      const topY = teamTopY(round, j, 'top') + UNIT / 2   // center of top team
      const botY = teamTopY(round, j, 'bottom') + UNIT / 2 // center of bottom team
      const midY = matchupCenterY(round, j)

      if (side === 'left') {
        // Horizontal from top team right edge to midpoint
        lines.push({ x1: colWidth, y1: topY, x2: colWidth + halfGap, y2: topY })
        // Horizontal from bottom team right edge to midpoint
        lines.push({ x1: colWidth, y1: botY, x2: colWidth + halfGap, y2: botY })
        // Vertical connecting them
        lines.push({ x1: colWidth + halfGap, y1: topY, x2: colWidth + halfGap, y2: botY })
        // Horizontal out to next column
        lines.push({ x1: colWidth + halfGap, y1: midY, x2: colWidth + GAP, y2: midY })
      } else {
        // Mirror for right side
        lines.push({ x1: 0, y1: topY, x2: -halfGap, y2: topY })
        lines.push({ x1: 0, y1: botY, x2: -halfGap, y2: botY })
        lines.push({ x1: -halfGap, y1: topY, x2: -halfGap, y2: botY })
        lines.push({ x1: -halfGap, y1: midY, x2: -GAP, y2: midY })
      }
    })
    return lines
  }, [matches, round, side, colWidth])

  return (
    <div style={{ position: 'relative', width: colWidth, height: BRACKET_HEIGHT, flexShrink: 0 }}>
      {/* Round label */}
      <div
        style={{
          position: 'absolute',
          top: -28,
          left: 0,
          right: 0,
          textAlign: side === 'left' ? 'left' : 'right',
          fontSize: 10,
          fontFamily: 'monospace',
          color: '#333',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {ROUND_LABELS[round]}
      </div>

      {/* Connector SVG */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
        width={colWidth}
        height={BRACKET_HEIGHT}
      >
        {connectors.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#222"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Team slots */}
      {matches.map((match, j) => {
        const topY = teamTopY(round, j, 'top')
        const botY = teamTopY(round, j, 'bottom')
        return (
          <div key={match.id}>
            <TeamSlot
              team={match.top}
              isWinner={match.winner?.id === match.top?.id}
              isEliminated={!!(match.top && eliminatedIds.has(match.top.id) && match.winner?.id !== match.top.id)}
              onClick={() => match.top && onAdvance(j, match.top)}
              style={{ top: topY }}
            />
            {/* Divider between the two teams */}
            <div
              style={{
                position: 'absolute',
                top: botY,
                left: 8,
                right: 8,
                height: 1,
                background: '#1a1a1a',
              }}
            />
            <TeamSlot
              team={match.bottom}
              isWinner={match.winner?.id === match.bottom?.id}
              isEliminated={!!(match.bottom && eliminatedIds.has(match.bottom.id) && match.winner?.id !== match.bottom.id)}
              onClick={() => match.bottom && onAdvance(j, match.bottom)}
              style={{ top: botY }}
            />
          </div>
        )
      })}
    </div>
  )
}
