<template>
    <div>
        <h1>首页</h1>
        <button @click="btn">按钮</button>
        {{ userStore.token }}
    </div>
</template>

<script setup>
// import { useStore } from '../store'
// const store = useStore();
// console.log( store.counter )

import { useUserStore } from '../store/useUserStore'
let userStore = useUserStore();
console.log( userStore.token  );

const btn = ()=>{
    userStore.token = 'fhdkhfdisfhdisfds';
}

// import { useStore } from '../store'
// const store = useStore();
// console.log( store.user.userName );

</script>