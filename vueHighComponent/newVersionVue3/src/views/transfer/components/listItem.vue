<template>
  <div>
    <div
      v-for="item in data"
      :key="item.id"
      :class="['list-item', item.disabled ? 'disabled' : '']"
      :draggable="!item.disabled"
      @dragstart="dragItem(item)"
    >
      <input
        type="checkbox"
        :disabled="item.disabled"
        :id="'__checkbox__' + item.id"
        @click="checkboxClick($event.target.checked, leftOrRight, item)"
      />
      <label :for="'__checkbox__' + item.id">{{ item.phone_name }}</label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  },
  leftOrRight: {
    type: String,
    validator(value) {
      return ['left', 'right'].includes(value)
    },
    default: ''
  }
})

const emit = defineEmits(['checkboxClick', 'dragItem'])
const checkboxClick = (checked, leftOrRight, item) => {
  emit('checkboxClick', checked, leftOrRight, item)
}

const dragItem = (item) => {
  emit('dragItem', item)
}
</script>