import { ChangeEvent } from 'react'
import { isBoard, isElement, Role } from '../game-creator/core'
import { AppState } from './App'

interface StatusProps {
  appState: AppState
  onAppStateChange: React.Dispatch<React.SetStateAction<AppState>>
}

const Status = ({ appState, onAppStateChange }: StatusProps) => {
  const { role } = appState

  const handleElementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onAppStateChange({
      role: +e.target.value as Role,
    })
  }

  const renderElement = () => {
    return (
      <div>
        <div>
          Role {isElement(role) ? '元素' : isBoard(role) ? '面板' : 'none'}
        </div>
        <div>
          <select value={role} onChange={handleElementChange}>
            <option value="0">Element</option>
            <option value="1">Map</option>
          </select>
        </div>
      </div>
    )
  }

  return <div>{renderElement()}</div>
}

export default Status
