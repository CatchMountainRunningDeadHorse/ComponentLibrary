import { defineStore } from "pinia";
import { ref } from "vue";
import { persistState } from '@renderer/utils/persistState';

export const useCount = defineStore('count',()=>{
    let counter = ref(JSON.parse(localStorage.getItem('counter')) || 0)
    persistState('counter',counter)
    function setCount (){
        counter.value++
    }

    return {counter,setCount}
})