function mounted(el, bingings) {
  bindEvent(el)
  el.allRows = getAllRows(el)
  el.targetNodes = new Set()
  el.weekdaytimeData = bingings.value
}

function bindEvent(el) {
  el.addEventListener('mousedown', handleMouseDown, false)
}

function handleMouseDown(e) {
  const tar = e.target
  const tagName = tar.tagName.toLowerCase()
  const el = this

  clearTargetNodes(el)

  if (tagName === 'td') {
    el.start = tar
    const rowIndex = Number(el.start.dataset.weekday)
    const columnIndex = Number(el.start.dataset.time)
    addTargetNode(el, tar)
    setWeekdayTimeData(el, rowIndex, columnIndex)
    el.addEventListener('mousemove', handleMouseMove, false)
    el.addEventListener('mouseup', handleMouseUp, false)
  }
}

function handleMouseMove(e) {
  const tar = e.target
  const tagName = tar.tagName.toLowerCase()
  const el = this

  if (tagName === 'td') {
    const startTarget = el.start
    const endTarget = tar

    const startRow = Number(startTarget.dataset.weekday)
    const startColumn = Number(startTarget.dataset.time)
    const endRow = Number(endTarget.dataset.weekday)
    const endColumn = Number(endTarget.dataset.time)

    const currenttargetNodes = getTargetNodes(el, startRow, startColumn, endRow, endColumn)
    getTargetNodeDiff(el, el.targetNodes, currenttargetNodes)
  }
}

function getTargetNodes(el, startRow, startColumn, endRow, endColumn) {
  const { allRows } = el
  const startR = startRow > endRow ? endRow : startRow
  const satrtC = startColumn > endColumn ? endColumn : startColumn
  const endR = startRow > endRow ? startRow : endRow
  const endC = startColumn > endColumn ? startColumn : endColumn
  const targetNodes = new Set()

  allRows.forEach((tr, rowIndex) => {
    if (rowIndex >= startR && rowIndex <= endR) {
      ;[...tr.querySelectorAll('td')].forEach((td, columnIndex) => {
        if (columnIndex >= satrtC && columnIndex <= endC) {
          targetNodes.add(td)
          setWeekdayTimeData(el, rowIndex, columnIndex)
          // console.log(el.weekdaytimeData)
        }
      })
    }
  })

  return targetNodes
}

function setWeekdayTimeData(el, weekday, time) {
  el.weekdaytimeData[weekday]
    ? el.weekdaytimeData[weekday].add(time)
    : (el.weekdaytimeData[weekday] = new Set([time]))
}

function getAllRows(el) {
  const oAllRows = el.querySelectorAll('tr')
  return [...oAllRows].reduce((prev, tr) => {
    if (tr.dataset.weekday) {
      prev.push(tr)
    }

    return prev
  }, [])
}

function getTargetNodeDiff(el, targetNodes, currenttargetNodes) {
  currenttargetNodes.forEach((td) => {
    !targetNodes.has(td) && addTargetNode(el, td)
  })

  targetNodes.forEach((td) => {
    !currenttargetNodes.has(td) && removeTargetNode(el, td)
  })
}

function addTargetNode(el, target) {
  el.targetNodes.add(target)
  target.classList.add('target')
}

function removeTargetNode(el, target) {
  el.targetNodes.delete(target)
  target.classList.remove('target')
}

function clearTargetNodes(el) {
  el.targetNodes.forEach((target) => {
    target.classList.remove('target')
  })

  el.targetNodes = new Set()
  //   el.weekdaytimeData = reactive([])  // 不能给weekdaytimeData整个重新赋值一个新数组，会破坏响应式
  el.weekdaytimeData.length = 0
}

function handleMouseUp() {
  const el = this
  el.removeEventListener('mousemove', handleMouseMove)
  el.removeEventListener('mouseup', handleMouseUp)
}

export default { mounted }
