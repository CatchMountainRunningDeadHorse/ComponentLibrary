<template>
  <transition name="my-ui-messagebox-fade">
    <div v-show="visible" class="ui-message-box" @click="cancelBtnClick">
      <div class="ui-message-box-wrapper" @click.stop>
        <div class="message-box-title">
          <h1>{{ title }}</h1>
          <span @click="cancelBtnClick">x</span>
        </div>
        <div class="message-box-content">
          <content-view :field="field" />
        </div>
        <div class="message-box-btn-group">
          <button @click="cancelBtnClick" v-if="showCancelBtn" class="btn-default">
            {{ cancelBtnText }}
          </button>
          <button @click="confirmBtnClick" class="btn-primary">{{ confirmBtnText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { h, reactive, toRefs } from 'vue'
import { fields } from './index'

const state = reactive({
  visible: false,
  promptValue: '',
  type: 'confirm'
})

const props = defineProps({
  showCancelBtn: {
    type: Boolean,
    default: false
  },
  cancelBtnText: {
    type: String,
    default: 'Cancel'
  },
  title: {
    type: String,
    default: 'Message'
  },
  content: {
    type: String,
    default: 'Message'
  },
  confirmBtnText: {
    type: String,
    default: 'OK'
  },
  field: {
    type: String,
    default: 'confirm',
    validator: (value) => {
      return fields.includes(value)
    }
  }
})

const { visible } = toRefs(state)

const setVisible = (isVisible) => {
  state.visible = isVisible
}

const confirmBtnClick = () => {
  state.type = 'confirm'
  setVisible(false)
}

const cancelBtnClick = () => {
  state.type = 'cancel'
  setVisible(false)
}

const ContentView = ({ field }) => {
  switch (field) {
    case !field || 'confirm':
      return h('p', null, props.content)
    case 'prompt':
      return h('input', {
        value: state.promptValue,
        onInput: (e) => (state.promptValue = e.target.value),
        class: 'message-input'
      })
    default:
      return ''
  }
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
.ui-message-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .ui-message-box-wrapper {
    background-color: #fff;
    color: #333;
    width: 420px;

    h1,
    p {
      margin: 0;
      font-weight: normal;
    }

    .message-box-title {
      padding: 15px 15px 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      h1 {
        font-size: 18px;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }
    .message-box-content {
      padding: 10px 15px;
      p {
        font-size: 14px;
      }
    }
    .message-box-btn-group {
      position: relative;
      float: right;
      display: flex;
      flex-direction: row;
      align-items: center;
      bottom: 0;
      padding: 5px 15px 15px;

      button {
        border: none;
        outline: none;
        height: 32px;
        padding: 8px 15px;
        border-radius: 3px;
        box-sizing: border-box;
        &.btn-primary {
          background-color: #4093ff;
          color: #fff;
          margin-left: 10px;
          border: 1px solid #4093ff;
        }
        &.btn-default {
          background-color: #fff;
          border: 1px solid #ddd;
        }
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