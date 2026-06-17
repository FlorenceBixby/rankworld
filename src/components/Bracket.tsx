'use client'
import { motion, AnimatePresence } from 'framer-motion'
import BracketColumn from './BracketColumn'
import TeamSlot from './TeamSlot'
import type { BracketData, Team } from '@/lib/types'
import { advanceTeam, BRACKET_HEIGHT, UNIT, matchupCenterY } from '@/lib/bracket'

const COL_WIDTH = 240
const COL_GAP = 24
const CHAMP_COL_WIDTH = 200

interface Props {
  bracket: BracketData
  onChange: (b: BracketData) => void
}

export default function Bracket({ bracket, onChange }: Props) {
  const handle = (side: 'left' | 'right', round: number, matchIdx: number, winner: Team) => {
    onChange(advanceTeam(bracket, side, round, matchIdx, winner))
  }

  const handleFinals = (pos: 'top' | 'bottom', winner: Team) => {
    onChange(advanceTeam(bracket, 'finals', 0, 0, winner))
  }

  // Champion Y = center of bracket
  const champY = BRACKET_HEIGHT / 2

  return (
    <div style={{ position: 'relative' }}>
      {/* Title */}
      <div className="mb-10 flex items-baseline gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">{bracket.title}</h1>
        <span className="text-sm font-mono text-[#444] uppercase tracking-widest">{bracket.category}</span>
        {bracket.champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: 'rgba(246,130,31,0.15)', border: '1px solid #F6821F', color: '#F6821F' }}
          >
            🏆 {bracket.champion.name}
          </motion.div>
        )}
      </div>

      {/* Bracket scroll container */}
      <div style={{ overflowX: 'auto', paddingBottom: 32, paddingRight: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: COL_GAP,
            paddingTop: 36,
            minWidth: 'max-content',
          }}
        >
          {/* LEFT SIDE — 5 rounds, left→right */}
          {bracket.left.map((matches, r) => (
            <BracketColumn
              key={`left-${r}`}
              round={r}
              matches={matches}
              side="left"
              colWidth={COL_WIDTH}
              onAdvance={(matchIdx, winner) => handle('left', r, matchIdx, winner)}
            />
          ))}

          {/* CHAMPIONSHIP COLUMN */}
          <div
            style={{
              position: 'relative',
              width: CHAMP_COL_WIDTH,
              height: BRACKET_HEIGHT,
              flexShrink: 0,
            }}
          >
            {/* Label */}
            <div
              style={{
                position: 'absolute',
                top: -28,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 10,
                fontFamily: 'monospace',
                color: '#F6821F',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Championship
            </div>

            {/* Left finalist slot */}
            <div style={{ position: 'absolute', top: champY - UNIT * 1.5, left: 0, width: COL_WIDTH }}>
              <TeamSlot
                team={bracket.finals.top}
                isWinner={bracket.finals.winner?.id === bracket.finals.top?.id}
                isEliminated={!!(bracket.finals.top && bracket.finals.winner && bracket.finals.winner.id !== bracket.finals.top.id)}
                onClick={() => bracket.finals.top && handleFinals('top', bracket.finals.top)}
              />
            </div>

            {/* Champion display */}
            <div
              style={{
                position: 'absolute',
                top: champY - 28,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: 140,
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>🏆</div>
              <AnimatePresence mode="wait">
                {bracket.champion ? (
                  <motion.div
                    key={bracket.champion.id}
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#F6821F',
                      lineHeight: 1.3,
                      padding: '6px 10px',
                      background: 'rgba(246,130,31,0.1)',
                      borderRadius: 6,
                      border: '1px solid rgba(246,130,31,0.3)',
                    }}
                  >
                    {bracket.champion.name}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-champ"
                    style={{ fontSize: 11, fontFamily: 'monospace', color: '#333' }}
                  >
                    CHAMPION
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right finalist slot */}
            <div style={{ position: 'absolute', top: champY + UNIT * 0.5, left: 0, width: COL_WIDTH }}>
              <TeamSlot
                team={bracket.finals.bottom}
                isWinner={bracket.finals.winner?.id === bracket.finals.bottom?.id}
                isEliminated={!!(bracket.finals.bottom && bracket.finals.winner && bracket.finals.winner.id !== bracket.finals.bottom.id)}
                onClick={() => bracket.finals.bottom && handleFinals('bottom', bracket.finals.bottom)}
              />
            </div>

            {/* Connector lines from finalists to center */}
            <svg
              style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
              width={CHAMP_COL_WIDTH}
              height={BRACKET_HEIGHT}
            >
              {/* Left finalist → center */}
              <line x1={0} y1={champY - UNIT} x2={-COL_GAP / 2} y2={champY - UNIT} stroke="#222" strokeWidth={1} />
              {/* Right finalist → center */}
              <line x1={0} y1={champY + UNIT} x2={-COL_GAP / 2} y2={champY + UNIT} stroke="#222" strokeWidth={1} />
            </svg>
          </div>

          {/* RIGHT SIDE — 5 rounds, right→left (reversed) */}
          {[...bracket.right].reverse().map((matches, reversedIdx) => {
            const r = bracket.right.length - 1 - reversedIdx
            return (
              <BracketColumn
                key={`right-${r}`}
                round={r}
                matches={matches}
                side="right"
                colWidth={COL_WIDTH}
                onAdvance={(matchIdx, winner) => handle('right', r, matchIdx, winner)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
