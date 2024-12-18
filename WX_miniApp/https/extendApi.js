export const toast = ({ title = '数据加载中...', icon = 'none', duration = 2000, mask = true } = {}) => {
  wx.showToast({
    title,  //提示的内容
    icon,  //提示的图标，success(成功)、error(失败)、loading(加载)、none(不显示图标)
    duration,  //提示的延迟时间
    mask,  //是否显示透明蒙层，防止触摸穿透
  })
}

export const modal = (options={}) => {
  //在方法内部需要通过 Promise 返回用户的操作
  //如果以后点击了确定，需要通过 resolve 返回 true
  //如果以后点击了取消，需要通过 resolve 返回 false
  return new Promise((resolve)=>{
    const defaultOpt = {
      title:'提示',
      content:'您确定执行该操作吗？',
      confirmColor:'#f3514f',
    }

    const Opts = Object.assign({},defaultOpt,options)
    wx.showModal({
      ...Opts,
      complete: ({confirm,cancel}) => {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}