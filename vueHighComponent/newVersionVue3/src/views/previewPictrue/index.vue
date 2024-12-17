<template>
  <image-preview :data="data"></image-preview>
</template>

<script setup>
import ImagePreview from './components/imagePreview/index.vue'
const data = [
  {
    id: 1,
    image: '006.png',
    rotate: 0,
    scale: 1
  },
  {
    id: 2,
    image: '009.png',
    rotate: 0,
    scale: 1
  },
  {
    id: 3,
    image: 'desk.jpg',
    rotate: 0,
    scale: 1
  },
  {
    id: 4,
    image: 'login.jpg',
    rotate: 0,
    scale: 1
  }
]
</script>