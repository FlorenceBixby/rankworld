'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Bracket from '@/components/Bracket'
import { createSportsMoviesBracket } from '@/lib/bracket'
import type { BracketData } from '@/lib/types'

export default function Home() {
  const [bracket, setBracket] = useState<BracketData>(createSportsMoviesBracket)

  const reset = () => setBracket(createSportsMoviesBracket())

  const progress = (() => {
    let total = 0, done = 0
    ;[...bracket.left, ...bracket.right].forEach(round =>
      round.forEach(m => { total++; if (m.winner) done++ })
    )
    if (bracket.finals.top && bracket.finals.bottom) { total++; if (bracket.finals.winner) done++ }
    return total > 0 ? Math.round((done / total) * 100) : 0
  })()

  return (
    <main className="min-h-screen px-6 py-8 md:px-12">
      {/* Nav */}
      <nav className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tighter text-white">
            RANK<span style={{ color: '#F6821F' }}>WORLD</span>
          </span>
          <span className="text-[10px] font-mono text-[#333] uppercase tracking-widest mt-1">beta</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-32 h-1 rounded-full bg-[#1a1a1a] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#F6821F' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#444]">{progress}%</span>
          </div>
          <button
            onClick={reset}
            className="text-[11px] font-mono text-[#444] hover:text-white transition-colors uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </nav>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[12px] font-mono text-[#333] mb-8 uppercase tracking-widest"
      >
        Click a team to advance them →
      </motion.p>

      <Bracket bracket={bracket} onChange={setBracket} />
    </main>
  )
}
