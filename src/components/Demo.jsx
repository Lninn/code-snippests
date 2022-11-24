import { useRef, useEffect } from 'react'
import './Demo.css'


const Demo = () => {
  return (
    <div className='Demo'>
      
      <Blank />
      <Blank />

      <List />
    </div>
  )
}

const Blank = () => {
  return (
    <div className="Blank">
      Blank
    </div>
  )
}

const Item = ({ index }) => {
  return (
    <div className="Item">
      Item {index}
    </div>
  )
}

const List = () => {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    setTimeout(() => {
      console.log(element);
      element.scrollTo(0, 200)
    }, 1000)

  }, [])

  return (
    <div className="List" ref={ref}>
      {Array.from({
        length: 10
      }).map((_, idx) => (
        <Item key={idx} index={idx} />
      ))}
    </div>
  )
}

export default Demo
