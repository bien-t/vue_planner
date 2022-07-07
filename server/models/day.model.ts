import mongoose from "mongoose";
import { EventInterface } from "./event.model";

export interface DayInterface {
    events:EventInterface[],
    dayIndex:number,
    date:Date
}

const DaySchema = new mongoose.Schema<DayInterface>({
    events:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }],
    dayIndex:Number,
    date:Date
})


export default mongoose.model('Day',DaySchema)