import dayjs from "dayjs" 
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance){

  app.post('/habits', async (req) => {

    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
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
                week_day: weekDay,
              }
            }) 
          }
        }
      })
  })

  app.get('/day', async (req) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })
    //localhost:3333/day?date=2023-01-13T03:00:00.000z
    const { date } = getDayParams.parse(req.query)

    const parsedDay = dayjs(date).startOf('day')
    const weekDay = parsedDay.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where:{
        created_at: {
          lte: date
        },
        weekDays:{
          some:{
            week_day: weekDay
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where:{
        date: parsedDay.toDate()
      },
      include: {
        dayHabits: true
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabits => {
      return dayHabits.habit_id
    })
    
    return {
      possibleHabits,
      completedHabits
    }
  })

  app.patch('/habits/:id/toggle', async (req) => {

    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })

    const { id } = toggleHabitParams.parse(req.params)

    const tody = dayjs().startOf('day').toDate()

    

  })

}