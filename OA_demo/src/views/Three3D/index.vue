<template>
  <div class="flex justify-between" style="width: 100%">
    <div class="column justify-between">
      <Trend />
      <Trend />
      <Trend />
    </div>
    <div style="width: calc(100% - 800px); min-width: 400px; height: 100%">
      <div style="text-align: center; height: 100%">
        <newTwoDMain v-if="isHome" />
        <twoDTransform v-else />
      </div>
      <!-- <div style="text-align: center; height: calc(100% - 600px)">
        <Trend />
      </div> -->
    </div>
    <div class="column">
      <Trend />
      <Trend />
      <Trend />
    </div>
  </div>
</template>

<script setup>
import Trend from './components/Trend'
import threeD from './components/threeD'
import twoDTransform from './components/twoDTransform.vue'
import newTwoDMain from './components/newTwoDMain'
import { provide, ref } from 'vue'
const isHome = ref(true)
provide('isHome', isHome)
</script>

<style></style>
