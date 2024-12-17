<template>
  <div>
    <button
      @click="
        Message.success({
          message: 'This is a SUCCESS text'
        })
      "
    >
      SHOW SUCCESS
    </button>
    <button
      @click="
        Message.warning({
          message: 'This is a WARNING text'
        })
      "
    >
      SHOW WARNING
    </button>
    <button
      @click="
        Message({
          message: 'This is a MESSAGE text',
          type: types.MESSAGE
        })
      "
    >
      SHOW MESSAGE
    </button>
    <button
      @click="
        Message({
          message: 'This is a ERROR text',
          type: types.ERROR
        })
      "
    >
      SHOW ERROR
    </button>
  </div>
</template>

<script setup>
import Message, { types } from './components/index.js'
</script>