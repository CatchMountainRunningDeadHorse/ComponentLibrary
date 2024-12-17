function formatRouterTree(data) {
  let parents = data.filter((p) => p.pid === 0),
    children = data.filter((c) => c.pid !== 0)

  dataToTree(parents, children)

  function dataToTree(parents, children) {
    parents.map((p) => {
      children.map((c, i) => {
        if (c.pid === p.id) {
          let _c = JSON.parse(JSON.stringify(children))
          _c.splice(i, 1)
          dataToTree([c], _c)

          if (p.children) {
            p.children.push(c)
          } else {
            p.children = [c]
          }
        }
      })
    })
  }

  return parents
}

function genarateRouter(userRouters) {
  const modules = import.meta.glob('@/components/*/*.vue')
  let newRouters = userRouters.map((r) => {
    let routes = {
      path: r.path,
      name: r.name,
      component: modules['@/' + r.link],
      meta: r.meta
    }
    if (r.children) {
      routes.children = genarateRouter(r.children)
    }
    return routes
  })
  return newRouters
}
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//获取一个月前的日期
function oneMonthBefore(date) {
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() - 1)
  return newDate
}

function dataClassify(data, p, array) {
  var mergedArr = []
  data.forEach((el) => {
    var mergedDict = {}
    let existingItem = mergedArr.find((entry) => {
      return p.every((key) => el[key] === entry[key])
    })
    if (existingItem) {
      existingItem.children.push(el)
    } else {
      array.forEach((key) => (mergedDict[key] = el[key]))
      mergedDict.children = [el]
      mergedArr.push(mergedDict)
    }
  })
  return mergedArr
}

function fieldValSplice(data, p, resField, spliceField) {
  const mergedArr = []
  data.forEach((el) => {
    const existingItem = mergedArr.find((entry) => {
      return p.every((key) => el[key] === entry[key])
    })
    if (existingItem) {
      existingItem[resField].push(el[spliceField])
    } else {
      el[resField] = []
      el[resField].push(el[spliceField])
      mergedArr.push(el)
    }
  })
  return mergedArr
}

function formatDate(date, Y = true, M = true, D = true, H = false, M1 = false, S = false) {
  let year, month, day, hour, minute, second
  if (Y) {
    year = date.getFullYear()
  }
  if (M) {
    month = date.getMonth() + 1
  }
  if (D) {
    day = date.getDate()
  }
  if (H) {
    hour = date.getHours()
  }
  if (M1) {
    minute = date.getMinutes()
  }
  if (S) {
    second = date.getSeconds()
  }
  const arr1 = []
  const arr2 = []
  Y ? arr1.push(year) : ''
  M ? arr1.push(month) : ''
  D ? arr1.push(day) : ''
  H ? arr2.push(hour) : ''
  M1 ? arr2.push(minute) : ''
  S ? arr2.push(second) : ''
  return `${arr1.map(formatNumber).join('-')} ${arr2.map(formatNumber).join(':')}`
}

function filtrate(arr, p) {
  const mergedArr = []
  arr.forEach((el) => {
    let existingItem = mergedArr.find((entry) => {
      return p.every((key) => el[key] === entry[key])
    })
    if (existingItem) {
      console.log()
    } else {
      mergedArr.push(el)
    }
  })
  return mergedArr
}

function IsIncludes(val, arr) {
  if (arr.includes(val)) {
    return true
  }
  return false
}

function sub(val, start = 0, end = 10) {
  if (val === undefined || !val.length) {
    return
  }
  if (val === '1900-01-01T00:00:00') {
    return
  }
  val = val.replace('T', ' ')
  return val.substring(start, end)
}

function statuString(Status) {
  if (Status == 0) {
    return '草稿'
  } else if (Status == 1) {
    return '审批中'
  } else if (Status == 2) {
    return '已通过'
  } else if (Status == 3) {
    return '已否决'
  } else if (Status == 4) {
    return '已撤回'
  } else if (Status == 5) {
    return '通过后撤回中'
  } else if (Status == 6) {
    return '已转交'
  }
}

function filFlow(arr, p) {
  const mergedArr = []
  arr.forEach((el) => {
    el.CheckManList = []
    let existingItem = mergedArr.find((entry) => {
      return p.every((key) => el[key] === entry[key])
    })
    if (existingItem) {
      existingItem.CheckManList.push(el.CheckMan)
      console.log()
    } else {
      el.CheckManList.push(el.CheckMan)
      mergedArr.push(el)
    }
  })
  return mergedArr
}

const uniqueFunc = (arr, uniId) => {
  const res = new Map()
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
}

export {
  formatRouterTree,
  genarateRouter,
  formatTime,
  oneMonthBefore,
  dataClassify,
  formatDate,
  filtrate,
  IsIncludes,
  sub,
  statuString,
  filFlow,
  uniqueFunc,
  fieldValSplice
}
