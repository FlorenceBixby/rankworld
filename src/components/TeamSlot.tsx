'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { Team } from '@/lib/types'

interface Props {
  team: Team | null
  isWinner: boolean
  isEliminated: boolean
  onClick: () => void
  style?: React.CSSProperties
}

export default function TeamSlot({ team, isWinner, isEliminated, onClick, style }: Props) {
  return (
    <div
      style={{ position: 'absolute', width: '100%', height: 36, ...style }}
    >
      <AnimatePresence mode="wait">
        {team ? (
          <motion.button
            key={team.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            disabled={isWinner || isEliminated}
            className="group w-full h-full flex items-center gap-2 px-3 text-left transition-colors"
            style={{
              background: isWinner
                ? 'rgba(246,130,31,0.12)'
                : 'rgba(255,255,255,0.03)',
              borderLeft: isWinner
                ? '2px solid #F6821F'
                : '2px solid transparent',
              opacity: isEliminated ? 0.3 : 1,
              cursor: isWinner || isEliminated ? 'default' : 'pointer',
            }}
            whileHover={!isWinner && !isEliminated ? { backgroundColor: 'rgba(255,255,255,0.06)' } : {}}
            whileTap={!isWinner && !isEliminated ? { scale: 0.98 } : {}}
          >
            <span
              className="text-[10px] font-mono w-5 shrink-0 text-right"
              style={{ color: isWinner ? '#F6821F' : '#444' }}
            >
              {team.seed}
            </span>
            <span
              className="truncate text-[12px] font-medium leading-none"
              style={{ color: isWinner ? '#fff' : '#aaa' }}
            >
              {team.name}
            </span>
            {!isWinner && !isEliminated && (
              <span className="ml-auto text-[10px] text-transparent group-hover:text-[#F6821F] transition-colors shrink-0">▶</span>
            )}
            {isWinner && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto text-[10px] text-cf"
              >✓</motion.span>
            )}
          </motion.button>
        ) : (
          <div
            key="empty"
            className="w-full h-full flex items-center px-3"
            style={{ borderLeft: '2px solid #1a1a1a' }}
          >
            <span className="text-[11px] font-mono text-[#2a2a2a]">TBD</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
