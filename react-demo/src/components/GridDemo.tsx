import TableDemo from "./TableDemo"

import './GridDemo.less'


const GridDemo = () => {
  return (
    <div className="GridDemo">
      <div className="GridDemo-left">
        <TableDemo />
      </div>
      <div className="GridDemo-right">
        Right
      </div>
    </div>
  )
}

export default GridDemo
