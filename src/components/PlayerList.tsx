import Ball from './Ball'

import type { Player } from '~/interfaces'

const PlayerList = (props: { players: Player[]; onChange?: (index: number) => (e: any) => void; removePlayer?: (index: number) => (e: any) => void }) => {
  return <div className="playerlist">
        {props.players.map((player, index) => (
            <div key={`player-${index}`} className={props.onChange ? 'form-group' : 'player-row'}>
                {props.onChange
                  ? <input
                        onChange={props.onChange(index)}
                        name={`player-${index}`}
                        type="color"
                        value={player.color}
                    />
                  : <div className="logo">
                        <Ball color={player.color} clicksToBlow={3} className={player.address ? 'large-ball shaking-more' : 'medium-ball'} />
                    </div>}
                {' '}
                <label htmlFor={`player-${index}`}>{player.nick ?? `Player-${index + 1}`}</label>
                {(props.players.length > 2 && props.removePlayer) && <button onClick={props.removePlayer(index)}>Remove</button>}
            </div>
        ))}
    </div>
}

export default PlayerList
