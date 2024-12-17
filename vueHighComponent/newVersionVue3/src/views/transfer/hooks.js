import { computed, reactive, ref } from 'vue'
export function useTargetIndex(initialIndex) {
  const targetIndex = ref(initialIndex)

  function setTargetIndex(newIndex) {
    targetIndex.value = Number(newIndex)
  }

  return {
    setTargetIndex,
    targetIndex
  }
}

export function useRightListData(initialData, checkedData) {
  const rightListData = ref(initialData)
  function addRightListData(newData) {
    rightListData.value = [...rightListData.value, ...newData]

    checkedData.left = []
  }

  function removeRightListData(newData) {
    newData.forEach((item) => {
      rightListData.value = rightListData.value.filter((elem) => elem.id !== item.id)
    })
    checkedData.right = []
  }

  return {
    rightListData,
    addRightListData,
    removeRightListData
  }
}

export function useCheckedData() {
  const checkedData = reactive({
    left: [],
    right: []
  })

  function addCheckedData(leftOrRight, item) {
    switch (leftOrRight) {
      case 'left':
        checkedData.left.push(item)
        break
      case 'right':
        checkedData.right.push(item)
        break
      default:
        break
    }
  }

  function removeCheckedData(leftOrRight, id) {
    switch (leftOrRight) {
      case 'left':
        checkedData.left = checkedData.left.filter((item) => item.id !== id)
        break
      case 'right':
        checkedData.left = checkedData.right.filter((item) => item.id !== id)
        break
      default:
        break
    }
  }

  return {
    removeCheckedData,
    addCheckedData,
    checkedData
  }
}

export function useDragedItem() {
  const dragedItem = ref(null)

  function setDragedItem(item) {
    dragedItem.value = item
  }

  return {
    setDragedItem,
    dragedItem
  }
}

export function useComputed(data, targetIndex, rightListData, checkedData) {
  const leftTitle = computed(() => {
    return data[targetIndex.value].title
  })

  const leftListData = computed(() => {
    const { data: currentData } = data[targetIndex.value]
    return currentData.filter((item) => {
      if (!rightListData.value.find(({ id }) => item.id === id)) {
        return item
      }
    })
  })

  const trandferButtonDisabled = computed(() => ({
    left: checkedData.right.length === 0,
    right: checkedData.left.length === 0
  }))

  return {
    leftTitle,
    leftListData,
    trandferButtonDisabled
  }
}
