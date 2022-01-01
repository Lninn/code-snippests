import { useState } from "react";
import { ElementKey, Actions } from "../game-creator/type";
import { elementKeys } from "../game-creator/constant";

interface ControlsProps {
  actions?: Actions;
}

function Controls({ actions }: ControlsProps) {
  const [selKey, setSelKey] = useState(elementKeys[0]);

  return (
    <div className="controls-wrap">
      <div>操作</div>
      <div className="actions-wrap">
        <button onClick={actions?.onPaused}>暂停</button>
        <button onClick={actions?.move}>移动</button>
        <button onClick={actions?.onTransform}>变换</button>
        <select
          value={selKey}
          onChange={(e) => {
            const key = e.target.value;

            setSelKey(key);
            actions?.onElementUpdate(key as ElementKey);
          }}
        >
          {elementKeys.map((key) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
        </select>
        <button onClick={actions?.onPrint}>日志</button>
      </div>
    </div>
  );
}

export default Controls;
