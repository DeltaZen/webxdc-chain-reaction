export interface AppProps {
  state?: AppState
  grid: any
  rows: number
  cols: number
  gameEnded: boolean
  gameStarted: boolean
  currentPlayer: number
  turn: number
  players: Player[]
  playerName: string
  playerAddr: string
  reset: () => unknown
  update: (state: UpdateState) => void
  adminUpdate: (state: UpdateState) => void
  modifyPlayer: (nick: string, address: string) => void
}

export interface AppState {
  showSettings: boolean
}

export interface Player {
  color: string
  alive: boolean
  nick?: string
  address?: string
}

export interface GameCellProps {
  clickCell: any
  x: number
  y: number
  status: any
  players: Player[]
  currentPlayer: number
  clicksToBlow: number
  gameStarted: boolean
  gameEnded: boolean
  playerAddr: string
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

export interface GameSettingsState {
  rows: string
  cols: string
  players: Player[]
  playerName: string
  playerAddr: string
}

export interface GameSettingsProps extends GameSettingsState {
  show: boolean
  initGame: (rows, cols, players) => unknown
}

export interface CRUpdate {
  type: string
  state: UpdateState
}

export interface UpdateState {
  grid: any
  currentPlayer: number
  players: Player[]
  rows: number
  cols: number
  turn: number
  gameStarted: boolean
  gameEnded: boolean
  send?: boolean
  playerName: string
  playerAddr: string
}
