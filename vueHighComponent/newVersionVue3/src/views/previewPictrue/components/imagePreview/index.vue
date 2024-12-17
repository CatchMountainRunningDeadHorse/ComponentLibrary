<template>
  <div class="image-preview">
    <indicator :dir="ARROW_DIRECTION.LEFT" @handle-image-slide="onHandleImageSlide"></indicator>
    <indicator :dir="ARROW_DIRECTION.RIGHT" @handle-image-slide="onHandleImageSlide"></indicator>
    <control-bar :icons="icons"></control-bar>
    <div
      class="slider"
      :style="{ width: SliderWidth + 'px', transform: `translate3d(-${sliderLeft}px,0,0)` }"
    >
      <image-container v-for="item of imageData" :key="item.id" :item="item"> </image-container>
    </div>
  </div>
</template>

<script setup>
import ImageContainer from './ImageContainer.vue'
import indicator from './indicator.vue'
import ControlBar from './ControlBar.vue'
import { ARROW_DIRECTION, ZOOM } from './types'
import { useSliderIndex, useComputed, useImageData } from './hooks'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const imgLen = props.data.length
const { setSliderIndex, sliderIndex } = useSliderIndex(imgLen)
const { sliderLeft } = useComputed(sliderIndex)

const { setImageRotate, setImageScale, imageData } = useImageData(props.data)

const SliderWidth = imgLen * 440

const onHandleImageSlide = (dir) => {
  imageReset(sliderIndex.value)
  setSliderIndex(dir)
}

const icons = [
  {
    icon: `icon-rotate-${ARROW_DIRECTION.LEFT}`,
    click: () => {
      return handleImageRotate(ARROW_DIRECTION.LEFT)
    }
  },
  {
    icon: `icon-rotate-${ARROW_DIRECTION.RIGHT}`,
    click: () => {
      return handleImageRotate(ARROW_DIRECTION.RIGHT)
    }
  },
  {
    icon: `icon-zoom-${ZOOM.OUT}`,
    click: () => {
      return handleImageScale(ZOOM.OUT)
    }
  },
  {
    icon: `icon-zoom-${ZOOM.IN}`,
    click: () => {
      return handleImageScale(ZOOM.IN)
    }
  }
]

const handleImageRotate = (dir) => {
  setImageRotate(sliderIndex.value, dir)
}

const handleImageScale = (zoom) => {
  setImageScale(sliderIndex.value, zoom)
}

const imageReset = (sliderIndex) => {
  const target = imageData.value[sliderIndex]
  target.rotate = 0
  target.scale = 1
}
</script>

<style scoped lang="scss">
.image-preview {
  position: relative;
  width: 440px;
  height: 248px;
  overflow: hidden;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;

  .slider {
    position: absolute;
    left: 0;
    top: 0;
    transition: transform 0.3s;
  }
}
</style>