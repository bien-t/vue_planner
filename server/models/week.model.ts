import mongoose from "mongoose";
import {DayInterface} from './day.model'

export interface WeekInterface {
    days:DayInterface[]
    weekNumber:number,
    year:number
}

const WeekSchema = new mongoose.Schema<WeekInterface>({
    days:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Day'
    }],
    weekNumber:Number,
    year:Number
})


export default mongoose.model('Week',WeekSchema)