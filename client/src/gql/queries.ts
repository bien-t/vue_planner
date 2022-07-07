import gql from "graphql-tag";

const getWeek = gql`
    query getWeek($date:Date!){
        getWeek(date:$date){
            _id
            weekNumber
            days{
                _id
                date
                events{
                    _id
                    text
                }
            }
        }
    }
`

export {
    getWeek
}