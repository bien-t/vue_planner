import mongoose from "mongoose";

export interface EventInterface {
    text:string
}

const EventSchema = new mongoose.Schema<EventInterface>({
    text:{
       type:String,
       maxlength:1000
    },
})


export default mongoose.model('Event',EventSchema)