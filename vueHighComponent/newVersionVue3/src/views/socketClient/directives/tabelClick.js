import { toRefs } from 'vue'

let tableClick = {}
export default {
  mounted(el, bingings) {
    const { userList, status, field, index, socket } = toRefs(bingings.value)
    tableClick.el = el
    tableClick.userList = userList
    tableClick.status = status
    tableClick.field = field
    tableClick.index = index
    tableClick.socket = socket.value
    bindEvent()
  }
}

function bindEvent() {
  tableClick.el.addEventListener('click', handleTableClick, false)
  window.addEventListener('click', handleWindowClick, false)
}

function handleTableClick(e) {
  handleStopPropagation(e)
  handleWindowClick()
  tableClick.target = getTarget(e)
  const target = tableClick.target
  const field = target.dataset.field
  const index = target.dataset.index

  if (field) {
    const tdText = target.innerText
    tableClick.oInput = createInput(tdText)
    target.appendChild(tableClick.oInput)
    tableClick.oInput.select()
    tableClick.field.value = field
    tableClick.index.value = index
    bindInputEvent()
    tableClick.socket.emit('changeStatus', true)
  }
}

function handleWindowClick() {
  if (tableClick.oInput) {
    updateUserList(tableClick.oInput.value)
    removeInput()
  }
}

function removeInput() {
  tableClick.target.removeChild(tableClick.oInput)
  unBindInputEvent()
  tableClick.oInput = null
  tableClick.target = null
  tableClick.socket.emit('changeStatus', false)
}

function bindInputEvent() {
  tableClick.oInput.addEventListener('click', handleStopPropagation, false)
  tableClick.oInput.addEventListener('input', handleInput, false)
}

function handleInput(e) {
  updateUserList(e.target.value)
}

function updateUserList(value) {
  tableClick.socket.emit('changeData', {
    field: tableClick.field.value,
    index: tableClick.index.value,
    data: value
  })
}

function unBindInputEvent() {
  tableClick.oInput.removeEventListener('click', handleStopPropagation, false)
  tableClick.oInput.removeEventListener('input', handleInput, false)
}

function createInput(value) {
  const oInput = document.createElement('input')

  oInput.value = value
  oInput.style.cssText = `
    width:100%;
    height:100%;
    border:none;
    box-sizing:border-box;
    position:absolute;
    top:0;
    left:0;
    `

  return oInput
}

function handleStopPropagation(e) {
  e.stopPropagation()
}
function getTarget(e) {
  const tagName = e.target.tagName.toLowerCase()

  switch (tagName) {
    case 'span':
      return e.target.parentNode
    case 'td':
      return e.target
    default:
      return e.target
  }
}
