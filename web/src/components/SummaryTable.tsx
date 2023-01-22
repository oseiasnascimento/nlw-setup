const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
import { generateDatesFromYaerBeginning } from '../utils/generate-dates-from-yaer-beginning'
import { HabitDay } from './HabitDay'

const summatyDates = generateDatesFromYaerBeginning()

const minimumSummatyDatesSize = 18 * 7 //weeks
const amountOfDaysToFill = minimumSummatyDatesSize - summatyDates.length

export function SummaryTable() {
  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekdays.map((weekday, i) => {
          return (
            <div
              key={`${weekday}-${i}`}
              className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center"
            >
              {weekday}
            </div>
          )
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summatyDates.map(date => {
          return (
            <HabitDay 
              key={date.toString()} 
              amount={5}  
              completed={Math.round(Math.random() * 5)} 
            />
          )
        })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="bg-zinc-900 w-10 h-10 text-white border-2 border-zinc-800 rounded-lg flex items-center justify-center opacity-40 cursor-not-allowed"
              />
            )
          })}
      </div>
    </div>
  )
}
