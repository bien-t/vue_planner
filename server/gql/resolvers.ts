import { DateResolver } from 'graphql-scalars';
import { WeekInterface } from '../models/week.model'
import { DayInterface } from '../models/day.model'

function getWeekNumber(date: Date) {
    const startDate = new Date(date.getFullYear(), 0, 1).valueOf() 
    const argDate = new Date(date).valueOf()
    const days = Math.ceil((argDate - startDate) /
        (24 * 60 * 60 * 1000))

    const weekNumber = (date.getDay() >= 5 || date.getDay() === 0) ? Math.floor(days / 7) : Math.ceil(days / 7)

    return weekNumber
}
export const resolvers = {
    Date: DateResolver,
    Week: {
        async days(parent: WeekInterface, args: any, { models }: any) {
            return await models.Day.find({ _id: parent.days })

        }
    },
    Day: {
        async events(parent: DayInterface, args: any, { models }: any) {
            return await models.Event.find({ _id: parent.events })
        }
    },
    Query: {
        async getWeek(parent: any, args: { date: Date }, { models }: any) {
            const weekNumber = getWeekNumber(args.date)
            const week = await models.Week.find({
                year: args.date.getFullYear(),
                weekNumber: weekNumber
            })

            if (week.length === 0) {
                const singleWeek = await new models.Week({
                    year: args.date.getFullYear(),
                    weekNumber: weekNumber,
                    days: []
                })
                const firstDate = new Date(args.date)
                const startDate = args.date.getDay() == 0 ? new Date(firstDate.setDate(args.date.getDate() - 7)) : new Date(args.date)
                for (let i = 0; i <= 6; i++) {
                    const secondDate = new Date(args.date)
                    const singleDay = await models.Day.create({
                        dayIndex: i, date: new Date(secondDate.setDate(startDate.getDate() - startDate.getDay() + i + 1)), events: []
                    })
                    singleWeek.days.push(singleDay)
                }
                await singleWeek.save()

                return await models.Week.find({
                    year: args.date.getFullYear(),
                    weekNumber: weekNumber
                })
            } else {
                return week
            }
        },
    },
    Mutation: {
        async addEvent(parent: any, args: { text: string, date: Date }, { models }: any) {
            const createEvent = await models.Event.create({
                text: args.text
            })

            await models.Day.findOneAndUpdate({
                date: args.date
            }, {
                $push: {
                    events: createEvent._id
                }
            })

            return await models.Event.findById(createEvent._id)
        },
        async updateEvent(parent: any, args: { id: string, text: string }, { models }: any) {
            return await models.Event.findByIdAndUpdate(args.id, { text: args.text }, { new: true })
        },
        async deleteEvent(parent: any, args: { id: string }, { models }: any) {
            return await models.Event.findByIdAndDelete(args.id)
        }
    }
}