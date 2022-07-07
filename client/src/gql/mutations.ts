import gql from "graphql-tag";

const addEvent = gql`
    mutation addEvent($date:Date!,$text:String!){
        addEvent(date:$date,text:$text){
            _id
            text
        }
    }
`

const updateEvent = gql`
mutation updateEvent($id:ID!,$text:String!){
    updateEvent(id:$id,text:$text){
        _id
        text
    }
}
`

const deleteEvent = gql`
mutation deleteEvent($id:ID!){
    deleteEvent(id:$id){
        _id
    }
}
`
export {
    addEvent,
    updateEvent,
    deleteEvent
}