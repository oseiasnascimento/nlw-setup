import './styles/global.css'

import { Habit } from "./components/Habit"

function App() {
  return (
      <div className='bg-zinc-500'>
      <Habit completed={3}></Habit>
      <Habit completed={6}></Habit>
      <Habit completed={9}></Habit>
      <Habit completed={5}></Habit>
      <Habit completed={6}></Habit>
      </div>
  )
}

export default App
