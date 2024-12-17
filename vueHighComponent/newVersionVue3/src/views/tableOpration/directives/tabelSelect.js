export default {
  mounted(el, bingings) {
    vTableSelect.el = el
    bindEvent(bingings.value)
  }
}

let vTableSelect = {}
let isMouseOver = false
function bindEvent(state) {
  const { el } = vTableSelect
  el.addEventListener('click', handleTDClick.bind(el, state), false)
  el.addEventListener('dblclick', handleTDDbclick.bind(el, state), false)
  window.addEventListener('click', handleWindowClick.bind(el, state), false)
  el.addEventListener('mousedown', handleTDMouseDown.bind(el, state), false)
}

function handleTDClick(...[state, e]) {
  if (!isMouseOver) {
    e.stopPropagation() //阻止事件冒泡
    const { target } = e
    resetSelectedData(state)
    if (target.tagName === 'TD') {
      const { row, column } = getRowAndCloumn(target)
      const selectedData = getTargetData(state.data, row, column)
      if (state.selectedData !== selectedData) {
        selectedData.selected = true
        state.selectedData = selectedData
      }
    }
  }
}

function resetSelectedData(state) {
  const { el } = vTableSelect
  if (state.selectedData) {
    state.selectedData.selected = false
  }
  if (state.selectedAreaData.length) {
    state.selectedAreaData.forEach((data) => {
      data.selected = false
    })
    state.selectedAreaData = []
  }
  if (el.oInput) {
    el.oInput.remove()
    el.oInput = null
  }
}

function createInput(target, data, row, column) {
  const { content } = getTargetData(data, row, column)
  const oInput = document.createElement('input')
  oInput.type = 'text'
  oInput.value = content
  oInput, (onfocus = oInput.select)
  target.appendChild(oInput)
  oInput.focus()
  oInput.style.cssText = `
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    box-sizing:border-box;
    text-align:center;
    font-size:16px;
  `

  return oInput
}

function handleWindowClick(state) {
  this.oInput && (state.selectedData.content = this.oInput.value)
  !isMouseOver && resetSelectedData(state)
}

function handleTDMouseDown(...[state, e]) {
  e.stopPropagation()
  isMouseOver = false
  const { target } = e
  const _handleMouseOver = handleMouseOver.bind(this, state)
  resetSelectedData(state)
  document.addEventListener('mouseover', _handleMouseOver, false)
  document.addEventListener('mouseup', handleTDMouseUp, false)

  if (target.tagName === 'TD') {
    const { row, column } = getRowAndCloumn(target)
    this.startRow = row
    this.startColumn = column
  }

  function handleTDMouseUp() {
    document.removeEventListener('mouseover', _handleMouseOver, false)
    document.removeEventListener('mouseup', handleTDMouseUp, false)
    setTimeout(() => (isMouseOver = false))
  }
}

function handleMouseOver(...[state, e]) {
  e.stopPropagation()
  isMouseOver = true
  const { target } = e
  if (target.tagName === 'TD') {
    const { row, column } = getRowAndCloumn(target)
    this.endRow = row
    this.endColumn = column
    state.selectedAreaData = getSelectedAreaData(
      state.data,
      this.startRow,
      this.startColumn,
      this.endRow,
      this.endColumn
    )
  }
}

function handleTDDbclick(...[state, e]) {
  e.stopPropagation()
  const { target } = e
  resetSelectedData(state)
  if (target.tagName === 'TD') {
    const { row, column } = getRowAndCloumn(target)
    state.selectedData = getTargetData(state.data, row, column)
    this.oInput = createInput(target, state.data, row, column)
  }
}

function getRowAndCloumn(target) {
  const { dataset } = target

  return {
    row: Number(dataset.row),
    column: Number(dataset.cloumn)
  }
}

function getSelectedAreaData(data, startRow, startColumn, endRow, endColumn) {
  const selectedAreaData = []
  if (startRow <= endRow) {
    for (let i = startRow; i <= endRow; i++) {
      setSelectedAreaData(data[i].data, startColumn, endColumn)
    }
  } else {
    for (let i = startRow; i >= endRow; i--) {
      setSelectedAreaData(data[i].data, startColumn, endColumn)
    }
  }

  function setSelectedAreaData(rowData, startColumn, endColumn) {
    if (startColumn <= endColumn) {
      for (let j = startColumn; j <= endColumn; j++) {
        pushColumnData(rowData[j])
      }
    } else {
      for (let j = startColumn; j >= endColumn; j--) {
        pushColumnData(rowData[j])
      }
    }

    function pushColumnData(columnData) {
      columnData.selected = true
      selectedAreaData.push(columnData)
    }
  }
  return selectedAreaData
}

function getTargetData(data, row, column) {
  let target = null
  data.forEach((_row, _rowIndex) => {
    if (row === _rowIndex) {
      _row.data.forEach((_column, _columnIndex) => {
        if (column === _columnIndex) {
          target = _column
        }
      })
    }
  })
  return target
}
