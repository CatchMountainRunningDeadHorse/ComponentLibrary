<template>
    <div>
        <button @click='login'>登录</button>
    </div>
</template>

<script setup>

import { useStore } from '@store'
let store = useStore();

import { loginByJson } from '@api/login'

const login = async ()=>{
    let res = await loginByJson({
        "password": "1899ddee9d860a0c452dd91844cb7a1c",
        "username": "6a89e60b1231d61d4bf89a08e4fc6229",
        "key": "123",
        "captcha": "2f3j"
    })
    console.log( res );
}

</script>