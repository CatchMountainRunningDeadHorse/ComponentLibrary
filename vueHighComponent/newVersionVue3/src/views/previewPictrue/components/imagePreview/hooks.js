import { computed, ref } from 'vue'
import { ARROW_DIRECTION, ZOOM } from './types'

export function useSliderIndex(imgLen) {
  const sliderIndex = ref(0)
  const setSliderIndex = (dir) => {
    const index = sliderIndex.value

    switch (dir) {
      case ARROW_DIRECTION.LEFT:
        sliderIndex.value = index <= 0 ? imgLen - 1 : index - 1
        break
      case ARROW_DIRECTION.RIGHT:
        sliderIndex.value = index >= imgLen - 1 ? 0 : index + 1
        break
      default:
        break
    }
  }

  return {
    setSliderIndex,
    sliderIndex
  }
}

export function useComputed(sliderIndex) {
  const sliderLeft = computed(() => {
    return sliderIndex.value * 440
  })

  return {
    sliderLeft
  }
}

export function useImageData(images) {
  const imageData = ref(images)

  const setImageRotate = (sliderIndex, dir) => {
    const rotate = imageData.value[sliderIndex].rotate
    switch (dir) {
      case ARROW_DIRECTION.LEFT:
        imageData.value[sliderIndex].rotate = rotate - 90
        break
      case ARROW_DIRECTION.RIGHT:
        imageData.value[sliderIndex].rotate = rotate + 90
        break
      default:
        break
    }
  }
  const setImageScale = (sliderIndex, zoom) => {
    const scale = imageData.value[sliderIndex].scale
    switch (zoom) {
      case ZOOM.OUT:
        scale < 3 && (imageData.value[sliderIndex].scale += 0.1)
        break
      case ZOOM.IN:
        scale > 0.2 && (imageData.value[sliderIndex].scale -= 0.1)
        break
      default:
        break
    }
  }

  return {
    setImageRotate,
    setImageScale,
    imageData
  }
}
