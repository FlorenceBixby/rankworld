export interface Team {
  id: string
  name: string
  seed: number
}

export interface Match {
  id: string
  top: Team | null
  bottom: Team | null
  winner: Team | null
}

export interface BracketData {
  id: string
  title: string
  category: string
  createdAt: string
  // 5 rounds each side (R64→R32→R16→R8→R4)
  left: Match[][]
  right: Match[][]
  finals: Match
  champion: Team | null
}
