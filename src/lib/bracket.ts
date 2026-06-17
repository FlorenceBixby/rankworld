import type { Team, Match, BracketData } from './types'

// ─── Sports Movies seeding ────────────────────────────────────────────────────
const LEFT_TEAMS = [
  'Hoosiers', 'Eight Men Out', 'The Color Of Money', 'Invictus',
  'Miracle', 'The Fighter', 'Seabiscuit', 'Slapshot',
  'Million Dollar Baby', 'Coach Carter', 'Tin Cup', 'The Longest Yard',
  'A League Of Their Own', 'Talladega Nights', 'Radio', 'Bull Durham',
  'Rocky', 'Happy Gilmore', 'We Are Marshall', 'Cinderella Man',
  'The Karate Kid', 'Above The Rim', 'The Express', 'The Wrestler',
  'Major League', 'Ali', 'Foxcatcher', 'Invincible',
  'Pride Of The Yankees', 'Days of Thunder', 'Rush', 'Field Of Dreams',
]

const RIGHT_TEAMS = [
  'Raging Bull', 'Vision Quest', 'Any Given Sunday', 'He Got Game',
  'The Rookie', 'The Mighty Ducks', 'Over The Top', 'Remember The Titans',
  'Chariots Of Fire', 'Cool Runnings', 'Free Solo', "White Men Can't Jump",
  'The Blind Side', 'Kingpin', 'Varsity Blues', 'The Natural',
  'Caddyshack', 'Secretariat', 'Ford Vs Ferrari', 'For The Love Of The Game',
  'The Hurricane', 'The Waterboy', 'Creed', '61*',
  'The Sandlot', '42', 'Rookie Of The Year', 'Jerry Maguire',
  'Bad News Bears', 'The Greatest Game Ever Played', 'Moneyball', 'Rudy',
]

function makeRound0(teams: string[], side: string): Match[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `${side}-0-${i}`,
    top: { id: `${side}-t${i * 2}`, name: teams[i * 2], seed: i * 2 + 1 },
    bottom: { id: `${side}-t${i * 2 + 1}`, name: teams[i * 2 + 1], seed: i * 2 + 2 },
    winner: null,
  }))
}

function makeEmptyRounds(side: string): Match[][] {
  return Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 8 >> r }, (_, j) => ({
      id: `${side}-${r + 1}-${j}`,
      top: null, bottom: null, winner: null,
    }))
  )
}

export function createSportsMoviesBracket(): BracketData {
  return {
    id: 'sports-movies-2024',
    title: 'Best Sports Movie Ever',
    category: 'Movies',
    createdAt: new Date().toISOString(),
    left: [makeRound0(LEFT_TEAMS, 'L'), ...makeEmptyRounds('L')],
    right: [makeRound0(RIGHT_TEAMS, 'R'), ...makeEmptyRounds('R')],
    finals: { id: 'finals', top: null, bottom: null, winner: null },
    champion: null,
  }
}

// ─── Advancement logic ────────────────────────────────────────────────────────
export function advanceTeam(
  bracket: BracketData,
  side: 'left' | 'right' | 'finals',
  round: number,
  matchIdx: number,
  winner: Team,
): BracketData {
  const next = structuredClone(bracket)

  if (side === 'finals') {
    next.finals.winner = winner
    next.champion = winner
    return next
  }

  const rounds = side === 'left' ? next.left : next.right
  rounds[round][matchIdx].winner = winner

  const nextRound = round + 1
  const nextMatchIdx = Math.floor(matchIdx / 2)
  const slot: 'top' | 'bottom' = matchIdx % 2 === 0 ? 'top' : 'bottom'

  // Advancing into finals
  if (nextRound === 5) {
    next.finals[slot] = winner
  } else {
    rounds[nextRound][nextMatchIdx][slot] = winner
  }

  return next
}

// ─── Layout math ─────────────────────────────────────────────────────────────
// For a 32-team half (5 rounds, R64 has 16 matchups):
// Total rows = 47, UNIT = row height in px
// matchup center row for round r, matchup j:
//   center = (3 * 2^r - 1) / 2  +  3 * 2^r * j
export const UNIT = 36  // px — height of one team slot
export const TOTAL_ROWS = 47
export const BRACKET_HEIGHT = TOTAL_ROWS * UNIT  // 1692px

export function matchupCenterY(round: number, matchIdx: number): number {
  const a = 3 * Math.pow(2, round)
  const c = (a - 1) / 2
  return (c + a * matchIdx) * UNIT
}

export function teamTopY(round: number, matchIdx: number, pos: 'top' | 'bottom'): number {
  const cy = matchupCenterY(round, matchIdx)
  return pos === 'top' ? cy - UNIT : cy
}
