import { useEffect, useRef, useState } from 'react'
import Controls from './Controls'
import { gameCreator } from '../game-creator'
import { Actions } from '../game-creator/type'
import { Role } from '../game-creator/core'
import Status from './Status'
import { Config } from '../game-creator/constant'

const InitialAppState = {
  role: 0 as Role,
}

export type AppState = typeof InitialAppState

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [actions, setActions] = useState<Actions>()

  const [appState, setAppState] = useState(InitialAppState)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const player = gameCreator({
      canvas,
    })

    player.getActions(function (actions: Actions) {
      setActions({
        ...actions,
        onStart() {
          player.start()
        },
      })
    })
  }, [])

  return (
    <div className="App">
      <Controls actions={actions} />

      <Status appState={appState} onAppStateChange={setAppState} />

      <canvas
        ref={canvasRef}
        width={Config.BoardWidth}
        height={Config.BoardHeight}
      ></canvas>
    </div>
  )
}

export default App
