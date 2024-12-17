const vRowDrag = {}
let dragingIndex = -1
let overIndex = -1
export default {
  mounted(el, bingings) {
    vRowDrag.el = el
    vRowDrag.data = bingings.value
    vRowDrag.trs = el.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
    init()
  }
}

function init() {
  ;[...vRowDrag.trs].forEach((tr) => {
    createDraggableElement(tr)
  })
  bindEvent()
}

function createDraggableElement(tr) {
  tr.draggable = true
  tr.addEventListener('dragstart', handleDragStart, false)
  tr.addEventListener('dragend', handleDragEnd, false)
}

function bindEvent() {
  window.addEventListener('dragover', (e) => e.preventDefault(), false)
  window.addEventListener('dragenter', (e) => e.preventDefault(), false)
  vRowDrag.el.addEventListener('dragenter', (e) => e.preventDefault(), false)
  vRowDrag.el.addEventListener('dragover', handleDragOver, false)
}

function handleDragStart(e) {
  const tar = e.target
  dragingIndex = [...vRowDrag.trs].findIndex((item) => item === tar)
}

function handleDragEnd() {
  if (overIndex !== -1) {
    let temp = vRowDrag.data[dragingIndex]
    vRowDrag.data[dragingIndex] = vRowDrag.data[overIndex]
    vRowDrag.data[overIndex] = temp
  }
  dragingIndex = -1
  overIndex = -1
}

function handleDragOver(e) {
  const tar = e.target.parentNode
  overIndex = [...vRowDrag.trs].findIndex((item) => item === tar)
}
