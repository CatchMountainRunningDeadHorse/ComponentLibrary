<template>
  <tr>
    <th></th>
    <th v-for="item of weekdays" :key="item.id" class="week-title">{{ item.title }}</th>
  </tr>
</template>

<script setup>
import './styles/week-title.scss'
import { weekdays } from '@/utils/util'
</script>

<style scoped lang="scss"></style>