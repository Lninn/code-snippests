import { Actions } from '../game-creator/type'

interface ControlsProps {
  actions?: Actions
}

function Controls({ actions }: ControlsProps) {
  return (
    <div className="controls-wrap">
      <div>操作</div>
      <div className="actions-wrap">
        <button onClick={actions?.onStart}>开始</button>
        <button onClick={actions?.onPaused}>暂停</button>
        <button onClick={actions?.move}>移动</button>
        <button onClick={actions?.onTransform}>变换</button>
        <button onClick={actions?.onPrint}>日志</button>
      </div>
    </div>
  )
}

export default Controls
