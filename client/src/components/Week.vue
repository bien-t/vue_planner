<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useQuery, provideApolloClient} from '@vue/apollo-composable'
import { getWeek } from '../gql/queries'
import Day from './Day.vue';
import { apolloClient } from '../main'

provideApolloClient(apolloClient)

const dateHelper = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : `${(date.getMonth() + 1)}`}-${date.getDate() < 10 ? `0${(date.getDate())}` : `${date.getDate()}`}`;
}

const weekData= reactive({ week:{}}) as any
const weekDate = ref(dateHelper(new Date()))

const { result } = useQuery(getWeek, { date: weekDate })
weekData.week = computed(()=>result.value?.getWeek[0].days)

const nextWeek = async () => {
    const newDate = new Date(weekData.week[0].date)
    weekDate.value = dateHelper(new Date(newDate.setDate(newDate.getDate() + 7)))
    const { result } = useQuery(getWeek, { date: weekDate })
    weekData.week = computed(()=>result.value?.getWeek[0].days)
}

const previousWeek = () => {
    const newDate = new Date(weekData.week[0].date)
    weekDate.value = dateHelper(new Date(newDate.setDate(newDate.getDate() - 7)))
    const { result } = useQuery(getWeek, { date: weekDate })
    weekData.week = computed(()=>result.value?.getWeek[0].days)
}

const changeDate = (event: Event) => {
    weekDate.value = dateHelper(new Date())
    const { result } = useQuery(getWeek, { date: (event.target as HTMLInputElement).value || weekDate.value })
    weekData.week = computed(()=>result.value?.getWeek[0].days)
}
</script>

<template>
    <section class="flex flex-col lg:flex-row lg:flex-wrap items-center w-full max-w-[1600px]">
        <div class="w-full flex justify-center mt-1">
            <input class="lg:ml-auto mr-2" type="date" name="" id="" @change="changeDate" />
            <button type="button" class=" mr-2 bg-[#003366] px-3 py-2 text-white" @click="previousWeek">Previous
                Week</button>
            <button type="button" class="bg-[#003366] px-3 py-2 text-white" @click="nextWeek">Next Week</button>
        </div>
        <div class="flex flex-col  lg:flex-row  w-11/12 lg:w-full mt-2 gap-2 lg:gap-0">

            <Day v-for="day in weekData.week" :key="day.dayIndex" :day="day" :weekDate="weekDate" />
        </div>
    </section>
</template>


<style>
</style>