<script setup lang="ts">
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { addEvent, updateEvent, deleteEvent } from '../gql/mutations';
import { getWeek } from '../gql/queries';
import gql from 'graphql-tag';
import { StoreObject, Reference } from '@apollo/client/cache';


const showAddForm = ref(false)
const showEditForm = ref(false)
const eventText = ref('')
const eventId = ref('')
const props = defineProps<{
    day: {
        _id: string,
        events: [{
            _id: string,
            text: string
        }
        ],
        date: Date
    },
    weekDate: string
}>()


interface getWeek {
    getWeek: [{
        _id: string
        weekNumber: number
        days: [{
            _id: string
            date: Date,
            events: [
                {
                    _id: string,
                    text: string
                }
            ]
        }
        ]
    }]
}
const showAddEventForm = () => {
    showAddForm.value = !showAddForm.value
    eventText.value = ''
}

const showEditEventForm = (id: string, text: string) => {
    showEditForm.value = true
    eventText.value = text
    eventId.value = id
}

const closeEditEventForm = () => {
    showEditForm.value = false
    eventText.value = ''
    eventId.value = ''
}

const submitAddEventForm = () => {
    const { mutate: sendForm } = useMutation(addEvent,
        () => ({
            variables: {
                date: props.day.date,
                text: eventText.value
            },
            update: (cache, { data: { addEvent } }) => {
                const data = cache.readQuery<getWeek>({
                    query: getWeek, variables: {
                        date: props.weekDate
                    }
                })!
                const dayIndex = new Date(props.day.date).getDay() === 0 ? 6 : new Date(props.day.date).getDay() - 1
                cache.writeQuery({
                    query: gql`
                        query addEvent($id:ID){
                            day(id:$ID){
                                _id
                                events {
                                    _id
                                }
                            }
                        }
                    `, variables: {
                        id: data.getWeek[0].days[dayIndex]._id
                    }, data: {
                        day: {
                            __typename: 'Day',
                            _id: data.getWeek[0].days[dayIndex]._id,
                            events: [...data.getWeek[0].days[dayIndex].events, addEvent],
                        }
                    }
                })
            }
        }))

    sendForm()
    showAddEventForm()
}

const submitEditEventForm = () => {
    const { mutate: editEvent } = useMutation(updateEvent, () => ({
        variables: {
            id: eventId.value,
            text: eventText.value
        }
    }))

    editEvent()
    closeEditEventForm()
}


const submitDeleteEvent = (id: string) => {
    const { mutate } = useMutation(deleteEvent, () => ({
        variables: {
            id: id
        },
        update: (cache) => {
            cache.modify({
                id: cache.identify({ id: props.day._id, __typename: 'Day' }),
                fields: {
                    events(currentEvents, { readField }) {
                        return currentEvents.filter(
                            (eventRef: Reference | StoreObject | undefined) => id !== readField('_id', eventRef)
                        )
                    }

                }
            })
        }
    }))
    mutate()
}
</script>

<template>
    <div class="flex flex-col min-w-[220px] max-w-full w-full border-l last:border-r border-b border-[#330066]">
        <div class="uppercase text-center text-white bg-[#003366] p-2">
            {{ new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(props.day.date)) }}<br>
            {{ props.day.date }}
        </div>
        <div class="p-2 h-[550px] overflow-y-auto bg-[#6699cc]">
            <div class="bg-[#66ccff] h-auto w-11/12 mx-auto mt-0 mb-2 flex p-1" v-for="event in day.events">
                <span class="text-ellipsis overflow-hidden">{{ event.text }}</span>
                <button @click="submitDeleteEvent(event._id)" class="ml-auto mr-1.5 self-center">
                    <font-awesome-icon icon="fa-solid fa-trash" class="w-5 h-5" />
                </button>
                <button @click="showEditEventForm(event._id, event.text)" class="mr-1.5 self-center">
                    <font-awesome-icon icon="fa-solid fa-pen" class="w-5 h-5" />
                </button>
            </div>
        </div>
        <button class="bg-[#003366] uppercase text-white py-1" @click="showAddEventForm">Add event</button>
    </div>

    <div v-if="showAddForm"
        class="w-full h-screen bg-orange-300/30 fixed top-0 left-0 flex justify-center items-center">
        <div class="w-[300px] h-[300px] bg-[#6699cc] relative">
            <form action="" class="pt-10  flex flex-col h-full" @submit.prevent="submitAddEventForm">
                <label class=" text-center uppercase mb-5">Add event</label>
                <textarea name="addEventArea" id="addEventArea" class="resize-none w-[95%] h-[50%] self-center"
                    v-model="eventText"></textarea>
                <button type="submit" class="mt-auto mb-5 bg-[#003366] self-center px-3 py-2 text-white">Submit</button>
            </form>
            <button type="button" @click="showAddEventForm"
                class="absolute top-0 right-0 bg-[#003366] w-8 h-8 flex justify-center items-center text-white cursor-pointer">X</button>
        </div>
    </div>

    <div v-if="showEditForm"
        class="w-full h-screen bg-orange-300/30 fixed top-0 left-0 flex justify-center items-center">
        <div class="w-[300px] h-[300px] bg-[#6699cc] relative">
            <form action="" class="pt-10  flex flex-col h-full" @submit.prevent="submitEditEventForm">
                <label class=" text-center uppercase mb-5">Edit event</label>
                <textarea name="editEventArea" id="editEventArea" class="resize-none w-[95%] h-[50%] self-center"
                    v-model="eventText"></textarea>
                <button type="submit" class="mt-auto mb-5 bg-[#003366] self-center px-3 py-2 text-white">Submit</button>
            </form>
            <button type="button" @click="closeEditEventForm"
                class="absolute top-0 right-0 bg-[#003366] w-8 h-8 flex justify-center items-center text-white cursor-pointer">X</button>
        </div>
    </div>
</template>