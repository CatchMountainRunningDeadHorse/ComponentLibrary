<template>
  <div class="container" v-outside>
    <div
      class="label flex align-items"
      @mouseover="showMenu"
      @mouseout="hideMenu"
      ref="label"
      @click.stop
    >
      <slot></slot>
    </div>
    <div v-if="menuVisible" class="popup-menu" :style="menuStyle">
      <div
        class="menu-item"
        v-for="(item, index) in menuPopup"
        :key="index"
        @click.stop="item.click(data)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const menuVisible = ref(false)
const menuStyle = ref({
  position: 'absolute'
})

const props = defineProps({
  data: {
    default: ''
  },
  menuPopup: {
    default: () => {
      return []
    },
    type: Array,
    required: true
  },
  position: {
    type: String,
    default: 'right'
  }
})

const vOutside = {
  mounted(el, binding, vnode) {
    //dom元素，参数集，虚拟dom（只有一个有用的属性 context 上下文的意思）
    // vnode.context 表示当前组件了
    //我们需要监听用户的点击行为，看在不在我们的日期选择面板
    el.hander = (e) => {
      //e 当前事件源对象
      //拿着面板的区域(el)和当前点击的区域(e.target)，做个对比
      //如果你点击的区域在日期选择面板区域内：不要隐藏面板
      //如果你点击的区域在日期选择面板区域外：要隐藏面板
      //contains 是包含的意思
      if (el.contains(e.target) && !menuVisible.value) {
        if (!menuVisible.value) {
          onFocus()
        }
      } else if (!el.contains(e.target) && menuVisible.value) {
        if (menuVisible.value) {
          onBlur()
        }
      }
    }
    document.addEventListener('mousemove', el.hander)
  },
  unmounted(el) {
    document.removeEventListener('mouseout', el.hander)
  }
}

const onFocus = () => {
  menuVisible.value = true
  updateMenuPosition()
}
const onBlur = (event) => {
  // 确保鼠标移出标签或菜单时隐藏菜单
  // if (!$el.contains(event.relatedTarget)) {
  menuVisible.value = false
  // }
}

const label = ref()
const updateMenuPosition = () => {
  const labelRect = label.value.getBoundingClientRect()
  if (props.position === 'right') {
    menuStyle.value.top = '0px'
    menuStyle.value.left = `${labelRect.width}px`
  } else if (props.position === 'left') {
    menuStyle.value.top = '0px'
    menuStyle.value.right = `${labelRect.width}px`
  } else if (props.position === 'top') {
    menuStyle.value.bottom = `${labelRect.height}px`
    menuStyle.value.right = '0px'
  } else if (props.position === 'bottom') {
    menuStyle.value.right = '0px'
    menuStyle.value.top = `${labelRect.height}px`
  }
}
</script>

<style scoped>
.container {
  position: relative;
  z-index: 999;
}
.label {
  cursor: pointer;
}
.popup-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
}
.menu-item {
  padding: 12px 15px;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 1px solid #ccc;
}
.menu-item:hover {
  color: #126bbe;
}
.flex {
  display: flex;
  flex-direction: row;
}

.align-items {
  align-items: center;
}
</style>
