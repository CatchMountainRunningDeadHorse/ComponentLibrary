<template>
  <div
    class="course-panel"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="hamdleDragEnd"
    :data-key="courseKey"
  >
    <h1>{{ courseName }}</h1>
    <span class="remove-btn">x</span>
  </div>
</template>

<script setup>
defineProps({
  courseName: {
    type: String,
    default: null
  },
  courseKey: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['handleDragEnd'])

function handleDragStart(e) {
  const tar = e.target
  tar.style.opacity = '0.6'
}

function hamdleDragEnd(e) {
  const tar = e.target
  tar.style.opacity = '1'

  emit('handleDragEnd', tar)
}
</script>

<style lang="scss">
.course-panel {
  position: relative;
  width: 100px;
  height: 70px;
  background-color: orange;
  margin: 10px auto;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  h1 {
    font-size: 20px;
    font-weight: normal;
    text-align: center;
  }
  .remove-btn {
    position: absolute;
    top: 0px;
    right: 10px;
    color: #fff;
  }
}
</style>
