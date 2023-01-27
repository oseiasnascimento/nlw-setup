import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { generateDatesFromYaerBeginning } from '../utils/generate-dates-from-yaer-beginning'
import { HabitDay } from './HabitDay'

const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYaerBeginning()

const minimumSummaryDatesSize = 18 * 7 //weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    })
  }, [])

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
        {summary.length > 0 && summaryDates.map(date => {
          const dayInSummaty = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day')
          })

          return (
            <HabitDay
              key={date.toString()}
              date={date}
              amount={dayInSummaty?.amount}
              defaultCompleted={dayInSummaty?.completed}
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
