<template>
  <div class="con">
    <div class="imgItem" v-for="(item, index) in images" :key="index" @click="updateImages(index)">
      <div class="inner" :style="{ color: item.color }">
        <p>{{ item.text }}</p>
        <p>{{ item.num }}(台)</p>
        <img :src="item.img" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watchEffect, getCurrentInstance } from 'vue'

const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
const images = ref([
  { text: '停机', color: '#f00', num: 1, img: '/static/img/1.png' },
  { text: '运行', color: '#0f0', num: 10, img: '/static/img/1.png' },
  { text: '离线', color: '#ccc', num: 2, img: '/static/img/1.png' },
  { text: '其他', color: '#ff0', num: 2, img: '/static/img/1.png' }
  // { text: '离线', color: '#ccc', num: 2, img: '/static/img/1.png' },
  // { text: '离线', color: '#ccc', num: 2, img: '/static/img/1.png' },
  // { text: '其他', color: '#ff0', num: 5, img: '/static/img/1.png' }
])
const isHome = inject('isHome')
const updateDynamicStyles = () => {
  const num = images.value.length
  const deg = 360 / num
  document.documentElement.style.setProperty('--num-items', num)
  document.documentElement.style.setProperty('--item-deg', `${deg}deg`)
}

const updateImages = (index) => {
  isHome.value = false
}

// Watch the images array and update styles accordingly
watchEffect(() => {
  updateDynamicStyles()
})
</script>

<style lang="scss" scoped>
$size: 800px;
$imgSize: 400px;

.con {
  width: $size;
  height: $size;
  margin-top: 50px;
  position: absolute;
  // outline: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: start;
  border-radius: 50%;
  z-index: 30;
  animation: rotate3D linear infinite 20s;
  &:hover {
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
    .imgItem .inner {
      animation-play-state: paused;
      -webkit-animation-play-state: paused;
    }
  }

  .imgItem {
    width: $imgSize / 2;
    height: $imgSize;
    position: absolute;
    margin-top: -100px;
    color: #fff;
    // text-align: center;

    .inner {
      width: 100%;
      height: 100%;
      p {
        height: 32px;
        text-align: center;
        transform: rotateX(10deg) scaleY(2);
      }
      img {
        height: 80%;
        width: 60%;
      }
    }
  }
}
.imgItem {
  transform-origin: center calc(#{$size} / 2 + #{$imgSize} / 4);

  // 使用 CSS 变量来动态控制旋转角度
  @for $i from 1 through 100 {
    &:nth-child(#{$i}) {
      $deg: calc(var(--item-deg) * (#{$i - 1}));
      transform: rotate($deg);
      .inner {
        --initDeg: #{$deg};
        transform: rotate(calc(-1 * $deg));
        animation: rotation 20s linear infinite reverse;
      }
    }
  }
}

@keyframes rotation {
  to {
    transform: rotate(calc(360deg - var(--initDeg, 0deg)));
  }
}

@keyframes rotate3D {
  0% {
    transform: rotateX(60deg) rotateZ(0);
  }
  100% {
    transform: rotateX(60deg) rotateZ(1turn);
  }
}
</style>
