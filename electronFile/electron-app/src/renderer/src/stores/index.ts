import { defineStore } from "pinia";
import { ref } from "vue";

export const useCount = defineStore('count',()=>{
    let counter = ref(0)
    function setCount (){
        counter.value++
    }

    return {counter,setCount}
})