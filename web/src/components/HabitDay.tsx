import * as Popover from '@radix-ui/react-popover';
import { ProgressBar } from './ProgerssBar';
interface HabitDayProps {
  completed: number | 0
}

export function HabitDay() {
  return  (
  <Popover.Root>
    <Popover.Trigger className="bg-zinc-900 w-10 h-10 text-white border-2 border-zinc-800 rounded-lg" />

    <Popover.Portal>
      <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col' >
        <span className="font-semibold text-zinc-400">domingo</span>
        <span className="font-semibold mt-1 leading-tight text-3xl">22/01</span>

        <ProgressBar progress={65} />

        <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
)
}