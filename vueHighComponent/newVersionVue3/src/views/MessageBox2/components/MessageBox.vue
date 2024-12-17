<template>
  <transition name="my-ui-messagebox-fade">
    <div v-show="visible" class="message-box" @click="BtnGroupClick('cancel')">
      <div class="message-box-wrapper" @click.stop>
        <div class="message-box-title">
          <h1>{{ title }}</h1>
          <span @click="BtnGroupClick('cancel')">x</span>
        </div>
        <div class="message-box-content">
          <content-view />
        </div>
        <button-group :data="props" @BtnGroupClick="BtnGroupClick"></button-group>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import ButtonGroup from './buttonGroup.vue'
const state = reactive({
  visible: false,
  type: 'confirm'
})

const { visible } = toRefs(state)
const props = defineProps({
  confirmBtnText: {
    type: String,
    default: 'Confirm'
  },
  cancelBtnText: {
    type: String,
    default: 'Cancel'
  },
  showCancelBtn: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'This is Title'
  },
  content: {
    default: 'This is MessageBox content'
  }
})

const setVisible = (isVisible) => {
  state.visible = isVisible
}

const BtnGroupClick = (type) => {
  switch (type) {
    case 'cancel':
      state.type = type
      setVisible(false)
      return
    case 'confirm':
      state.type = 'confirm'
      setVisible(false)
      return
    default:
      return
  }
}

const ContentView = () => {
  return props.content
}

defineExpose({
  setVisible,
  state
})
</script>

<style scoped lang="scss">
.my-ui-messagebox-fade-enter-from,
.my-ui-messagebox-fade-leave-to {
  opacity: 0;
}

.my-ui-messagebox-fade-enter-active {
  transition: opacity 0.2s ease-in;
}

.my-ui-messagebox-fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.message-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .message-box-wrapper {
    background-color: #fff;
    color: #333;
    width: 420px;

    h1,
    p {
      margin: 0;
      font-weight: normal;
    }

    .message-box-title {
      padding: 10px 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: #4093ff;
      color: #fff;
      h1 {
        font-size: 18px;
      }
      span {
        font-size: 20px;
      }
    }
    .message-box-content {
      padding: 10px 15px;
      p {
        font-size: 14px;
      }
    }
  }
  .message-input {
    border: none;
    outline: none;
    width: 100%;
    border: 1px solid #ddd;
    height: 32px;
    box-sizing: border-box;
  }
}
</style>