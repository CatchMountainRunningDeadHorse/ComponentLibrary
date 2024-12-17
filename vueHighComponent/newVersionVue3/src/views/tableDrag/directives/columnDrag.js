const vColumnDrag = {}
let dragingIndex = -1
let overIndex = -1
export default {
  mounted(el, bingings) {
    const { data, titles } = bingings.value
    vColumnDrag.el = el
    vColumnDrag.data = data
    vColumnDrag.titles = titles
    vColumnDrag.ths = el.getElementsByTagName('thead')[0].getElementsByTagName('th')

    init()
  }
}

function init() {
  console.log(vColumnDrag.ths)
  ;[...vColumnDrag.ths].forEach((th) => {
    createDraggableElement(th)
  })
  bindEvent()
}

function bindEvent() {
  window.addEventListener('dragover', (e) => e.preventDefault(), false)
  window.addEventListener('dragenter', (e) => e.preventDefault(), false)
  vColumnDrag.el.addEventListener('dragenter', (e) => e.preventDefault(), false)
  vColumnDrag.el.addEventListener('dragover', handleDragOver, false)
}

function createDraggableElement(th) {
  th.draggable = true
  th.addEventListener('dragstart', handleDragStart, false)
  th.addEventListener('dragend', handleDragEnd, false)
}

function handleDragStart(e) {
  const tar = e.target
  dragingIndex = [...vColumnDrag.ths].findIndex((th) => th === tar)
  console.log(dragingIndex)
}

function handleDragEnd() {
  if (overIndex !== -1) {
    const tempTitle = vColumnDrag.titles[dragingIndex]
    vColumnDrag.titles[dragingIndex] = vColumnDrag.titles[overIndex]
    vColumnDrag.titles[overIndex] = tempTitle

    vColumnDrag.data.forEach((item) => {
      const data = item[dragingIndex]
      item[dragingIndex] = item[overIndex]
      item[overIndex] = data
    })
  }
  dragingIndex = -1
  overIndex = -1
}

function handleDragOver(e) {
  const tar = e.target
  overIndex = [...vColumnDrag.ths].findIndex((th) => th === tar)
}
