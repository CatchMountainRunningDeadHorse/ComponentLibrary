export default class WxRequest {
  //定义实例属性，用来设置默认请求参数
  defaults = {
    baseUrl: '',  //请求基准地址
    url: '',  //接口的请求路径
    data: null,  //请求参数
    method: 'GET',  //默认的请求方法
    //设置请求头
    header: {
      "Content-type": "application/json",  //数据的交互格式
    },
    timeout: 30000,  //默认的超时时长，小程序默认的超时时长是1分钟
    isLoading: true,  //控制是否使用默认的loading，默认值是true，表示使用默认loading
  }

  //定义拦截器对象
  //需要包含请求拦截器以及响应拦截器，方便在请求之前以及响应以后时进行逻辑处理
  interceptors = {
    //请求拦截器（默认）
    //在请求发送之前，对请求参数进行新增或者修改
    request: (config) => config,
    //响应拦截器（默认）
    //在服务器响应数据以后，对服务器响应的数据进行逻辑处理
    response: (response) => response
  }

  //定义数组队列
  //初始值是一个空数组，用来存储请求队列，存储请求标识
  queue = []

  constructor(parmas = {}) {
    this.defaults = Object.assign({}, this.defaults, parmas)
  }


  request(options) {
    //如果有新的请求就清除上一次的定时器
    this.timerId && clearTimeout(this.timerId)

    //需要先合并完整的请求地址（baseUrl + url)
    options.url = this.defaults.baseUrl + options.url

    //合并请求参数
    options = { ...this.defaults, ...options }

    if (options.isLoading) {
      //判断queue队列是否为空，如果是空，就显示loading
      //如果不是空，就不显示loading，不调用 wx.showLoading()
      this.queue.length === 0 && wx.showLoading()
      //然后立即向queue队列中添加请求标识
      //每个标识代表一个请求，标识是自定义的
      this.queue.push('request')
    }


    //在请求发送之前，调用请求拦截器，新增或修改请求参数
    options = this.interceptors.request(options)

    return new Promise((resovle, reject) => {
      wx.request({
        ...options,
        //当接口调用成功时触发
        success: (res) => {
          //不管是成功响应还是失败响应都需要调用响应拦截器
          //响应拦截器需要接收服务器响应的数据，然后对数据进行处理，处理好以后进行返回
          //然后再通过 resolve 将返回的数据抛出去
          //在给响应拦截器传递参数时，需要将请求参数也一起传递
          //方便进行代码的调试或者进行其他逻辑处理，需要先合并参数
          //然后将合并的参数传递给响应连接器

          //不管是请求成功还是失败，都已经将响应的数据传递给了响应拦截器
          //这时候在合并参数的时候，追加一个属性 isSuccess 
          //如果属性值为 true，说明执行了 success 回调函数
          //如果属性值为 false，说明执行了 fail 回调函数
          const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
          resovle(this.interceptors.response(mergeRes))
        },
        //当接口调用失败时触发
        fail: (err) => {
          //不管是成功响应还是失败响应都需要调用响应拦截器
          //一般在网络出现异常时（网络超时），就会执行fail
          const mergeErr = Object.assign({}, err, { config: options, isSuccess: false })
          reject(this.interceptors.response(mergeErr))
        },
        //接口调用结束的回调函数（调用成功、失败都会执行）
        complete: () => {
          if (options.isLoading) {
            //每次从 queue 中删除一个标识
            this.queue.pop()

            this.queue.length === 0 && this.queue.push('request')

            this.timerId = setTimeout(() => {
              this.queue.pop()
              //在删除标识以后，需要判断目前queue队列是否为空
              //如果是空，说明 并发请求 或者 单个请求 完成了
              //就需要隐藏 loading 调用 wx.hideLoading()
              this.queue.length === 0 && wx.hideLoading()
              clearTimeout(this.timerId)
            }, 1)
          }
        }
      })
    })
  }

  //封装 get 实例方法
  get(url, data = {}, config = {}) {
    //需要调用 request 请求方法发送请求，只需要组织好参数，传递给 request 请求方法即可
    //当调用 get 方法时，需要将 request 方法的返回值 return 出去
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }

  //封装 post 实例方法
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }

  //封装 delete 实例方法
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }

  //封装 put 实例方法
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config))
  }

  //upload 实例方法，用来对wx.uploadFile 进行封装
  upload(url,filePath,name='file',config={}){
    return this.request(Object.assign({url,filePath,name,method:'UPLOAD'},config))
  }
}

