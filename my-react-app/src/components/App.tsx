import { useEffect, useRef, useState } from 'react'
import Controls from './Controls'
import { gameCreator } from '../game-creator'
import { Actions } from '../game-creator/type'

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [actions, setActions] = useState<Actions>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const player = gameCreator({
      canvas,
    })

    player.getActions(function (actions: Actions) {
      setActions(actions)
    })

    player.start()
  }, [])

  return (
    <div className="App">
      <Controls actions={actions} />

      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  )
}

export default App
