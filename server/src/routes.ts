import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async req => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })

    const { title, weekDays } = createHabitBody.parse(req.body)

    const tody = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: tody,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })
        }
      }
    })
  })

  app.delete('/habits/:id/:day/:weekday/delete', async req => {
    const deleteHabitParams = z.object({
      id: z.string().uuid(),
      day: z.string().uuid(),
      weekDay: z.number()
    })

    const { id, weekDay, day } = deleteHabitParams.parse(req.params)

    await prisma.habitWeekDays.delete({
      where: {
        habit_id_week_day:{
          habit_id: id,
          week_day: weekDay
        }
      }
    })

    await prisma.dayHabit.delete({
      where: {
        day_id_habit_id:{
          day_id: day,
          habit_id: id,
        }
      }
    })

    await prisma.habit.delete({
      where: {
        id: id
      }
    })
  })

  app.get('/day', async req => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })
    //localhost:3333/day?date=2023-01-13T03:00:00.000z
    const { date } = getDayParams.parse(req.query)

    const parsedDay = dayjs(date).startOf('day')
    const weekDay = parsedDay.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDay.toDate()
      },
      include: {
        dayHabits: true
      }
    })

    const completedHabits =
      day?.dayHabits.map(dayHabits => {
        return dayHabits.habit_id
      }) ?? []

    return {
      possibleHabits,
      completedHabits
    }
  })

  app.patch('/habits/:id/toggle', async req => {
    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })

    const { id } = toggleHabitParams.parse(req.params)

    const tody = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: tody
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: tody
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })

    if (dayHabit) {
      //remover a marcação de completar o hábito
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      ///adicionar a marcação de completar o hábito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }
  })

  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
    SELECT 
      D.id,
      D.date,
    (
      SELECT 
        cast(count(*) as float)
      FROM day_habits DH
      WHERE DH.day_id = D.id
    ) as completed,
    (
      SELECT 
        cast(count(*) as float)
      FROM habit_week_days HWD
      JOIN habits H
        ON H.id = HWD.habit_id
      WHERE 
        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
        AND H.created_at <= D.date
    ) as amount
    FROM days D
    `
    return summary
  })
}
