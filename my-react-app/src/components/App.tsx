import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import { createManageGame } from "../game-creator";
import { Actions } from "../game-creator/type";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [actions, setActions] = useState<Actions>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const manage = createManageGame({
      canvas,
      ctx,
      register(actions: Actions) {
        setActions(actions);
      },
    });

    manage.start();
  }, []);

  return (
    <div className="App">
      <Controls actions={actions} />

      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  );
}

export default App;
