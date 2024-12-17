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
  // 使用 defineAsyncComponent 动态加载组件
  let newRouters = userRouters.map((r) => {
    let routes = {
      path: r.path,
      name: r.name,
      component: () => import('../' + r.link),
      redirect: r.redirect
    }
    if (r.children) {
      routes.children = genarateRouter(r.children)
    }
    return routes
  })
  return newRouters
}

const weekdays = [
  {
    id: 1,
    title: '周一'
  },
  {
    id: 2,
    title: '周二'
  },
  {
    id: 3,
    title: '周三'
  },
  {
    id: 4,
    title: '周四'
  },
  {
    id: 5,
    title: '周五'
  },
  {
    id: 6,
    title: '周六'
  },
  {
    id: 7,
    title: '周日'
  }
]

export function formatScheduleData(data) {
  return data.reduce((pre1, cur1) => {
    pre1[cur1.begin_time + '_' + cur1.weekday] = cur1

    return pre1
  }, {})
}

export function weekdayToChinese(number) {
  switch (number) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 7:
      return '周日'
    default:
      break
  }
}

export function timeStampToTime(timestamp) {
  const date = new Date(timestamp * 1000)
  const hours = addZero(date.getHours())
  const minutes = addZero(date.getMinutes())

  function addZero(value) {
    return value < 10 ? '0' + value : value
  }

  return `${hours}:${minutes}`
}

export function checkHasData(scheduleData) {
  const text = scheduleData ? '编辑' : '新增'
  return `${text}课程安排`
}

export { formatRouterTree, genarateRouter, weekdays }
