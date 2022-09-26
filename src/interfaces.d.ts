export interface AppProps {
  state: AppState
  gameEnded: boolean
  currentPlayer: number
  reset: () => unknown
}

export interface AppState {
  showSettings: boolean
}

export interface Player {
  color: string
  alive: boolean
}

export interface GameCellProps {
  clickCell: any
  x: number
  y: number
  status: any
  players: Player[]
  currentPlayer: number
  clicksToBlow: number
  gameEnded: boolean
}

export interface GameGridProps {
  currentPlayer: Player
  rows: number
  cols: number
}

export interface GameLogicProps {
  rows: number
  cols: number
  currentPlayer: number
  players: Player[]
  grid: any
  x: number
  y: number
  turn: number
  cellsActivated: number
}
