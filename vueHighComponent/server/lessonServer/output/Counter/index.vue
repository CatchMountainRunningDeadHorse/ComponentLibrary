<template>
  <div class="app app2">
    <h1>{{ title + title1 }}</h1>
    <h2>{{ count + count1 }}</h2>
    <h3>{{ doubleCount }}</h3>
    <button @click="handleAddBtnClick($event), handleLogBtnClick()">ADD</button>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { handleAddBtnClick } from "./handler.js";
import { handleLogBtnClick } from "./handler.js";
import { count } from "./states";
import { count1 } from "./states";
const props = defineProps({
  title: String,
  title1: Object,
});
const doubleCount = computed(() => count.value * 2);
</script>