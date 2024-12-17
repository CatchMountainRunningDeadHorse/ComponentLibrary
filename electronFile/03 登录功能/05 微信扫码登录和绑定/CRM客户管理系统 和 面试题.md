# 一、性能优化





# 二、兼容处理

2.1 全屏设置兼容

```
//目前是否是放大
var isFull=!!(document.webkitIsFullScreen || document.mozFullScreen || 
        document.msFullscreenElement || document.fullscreenElement);

if(  isFull  ){//缩小   

      if (document.exitFullscreen) {
	        document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	        document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	        document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	        document.webkitExitFullscreen();
	    }

}else{//放大

      if (element.requestFullscreen) {
	        element.requestFullscreen();
	    } else if (element.msRequestFullscreen) {
	        element.msRequestFullscreen();
	    } else if (element.mozRequestFullScreen) {
	        element.mozRequestFullScreen();
	    } else if (element.webkitRequestFullscreen) {
	        element.webkitRequestFullscreen();
	    }

}
```







# 一、权限

1.1 左侧菜单权限

```
1. 用户登录，需要请求 【个人信息】 接口  （接口会返回：角色权限编码）
2. 接着 【获取路由】（需要把 角色权限编码 传递给后端）
3. 【获取路由】接口会返回 ： 对应登录的账号的权限路由树
```

1.2 右侧某按钮权限

```
1. 用户登录，需要请求 【个人信息】 接口  （接口会返回：权限信息）
2. 这时候会把后端返回过来的 用户的 “权限信息” 存储起来
3. 新建自定义指令 v-auth='某某权限字符'
4. 自定义指令大体的判断：
		1. 指令有没有传值
		2. 在用户的权限信息中， 有没有指令 传递过来的参数
		3. 如果有return ， 如果没有删除该节点
```

1.3 某某用户如果没有此权限不可以进入某某路由  [ 在软件级别的系统中，无需判断 ]

```
1. 在导航守卫【前置性导航守卫】进行判断 
2. 如果是超级管理员直接通行
3. 如果不是超级管理，需要拿到用户的所有路由信息（扁平化：map对象） 和 当前的路由判断，存不存在，如果不存在那么就提示（展示错误页面）
```

1.4 权限管理 [ 删除 、 新增 ]

```
前沿：其实权限是由 角色 来控制的
```

```
1. 给某某用户 “新增” 一个权限 
	直白点：给某某用户，新增一个 角色
2. 角色新增流程
	1. 点击新增按钮
	2. 获取菜单权限树
	3. 选择对应的权限，其实就是选择了某权限的id
	4. 当点击【确认新增】，需要给后端传递 沟通的权限id。
	5. 后端会把多个权限id，组合成一个 角色， 一个角色对应一个ID（ 这个id就是多个权限生成）
```

```
1. 给某某用户 “删除” 一个权限
	直白点：给某某用户，去掉一个 角色
	
	***要注意一点：如果某某用户，在使用本角色，那么直接删除（返回：30006 [数据存在引用资源] ）
		直白点：用户没有用某权限才可以删除，如果被引用会返回:30006
```

# 二、微信登录

***在开发平台中，是有基础url的，就是我们项目的网址



2.1 点击 微信登录 ==> 二维码

```
1. 渲染进程：点击按钮 ==> 通信主进程
2. 主进程：创建新窗口 ==> 打开由 后端 给 前端 的 url 从而展示二维码 ==> 二维码已经渲染到页面上了 
```

2.2 点击 微信登录 ==> 二维码 ==> 如何知道 用户 扫码了 ， 并且 成功成功

```
1. 主进程 监听 URL改变
2. 当URL改变的时候 ==》 去发送一个请求 ==》传递的参数:{
		url:网站的网址
		headers:{
			WechatOauthType:'login'
		}
}
3. 请求发送成功后 会返回 微信授权code码
4. 主进程 通信 渲染进程 同时把code码（微信授权code码）传递给渲染进程
5. 渲染进程拿到主进程给的code码（微信授权code码），再次发送请求 [获取AccessToken]，同时把code码（微信授权code码）传递给后端
	
	***后端返回：如果此微信用户 绑定过 会直接返回 token ， 如果没有绑定 会返回其他信息（该微信未绑定账号）
```



***微信登录之前，需要绑定  【在我们这个系统中是这样的：后台管理系统】



2.3 绑定用户

```
1. 渲染进程：点击按钮 ==> 通信主进程 （需要渲染进程给主进程传递token）
2. 主进程：创建新窗口 ==> 打开由 后端 给 前端 的 url 从而展示二维码 ==> 二维码已经渲染到页面上了 
3. 主进程 监听 URL改变
4. 当URL改变的时候 ==》 去发送一个请求 ==》 传递的参数:{
		url:网站的网址
		headers:{
			WechatOauthType:'bind',
			Authorization:'token'
		}
}
5. 请求发送成功后 会返回 微信授权code码
6. 主进程 通信 渲染进程 同时把code码（微信授权code码）传递给渲染进程
7. 渲染进程拿到主进程给的code码（微信授权code码），再次发送请求 [检查绑定状态]，同时把code码（微信授权code码）传递给后端
	
	***后端返回：如果此微信用户 绑定过 会返回 【已绑定】， 如果没有绑定 会返回【绑定成功】
```



# 二、 目前项目使用的vue技术

2.1 全局混入：字典

2.2 自定义指令：判断按钮级权限控制



# 三、其他vue的api

3.1 插槽

```
匿名：

父组件：
<Table>
        <span>这是插入的东西222222</span>
</Table>
    
    
子组件：
<template>      

    <div>第一行</div>
    <div>
        第二行
        <slot></slot>
    </div>
    <div>
        第三行
        <slot></slot>
    </div>

</template>
```

```
具名：

父组件：
		<Table>
        <template v-slot:er>
            <span>这是插入的东西222222</span>
        </template>    

        <template #san>
            <span>这是插入的东西333333</span>
        </template> 
    </Table>
    
    
子组件：
<template>      

    <div>第一行</div>
    <div>
        第二行
        <slot name="er"></slot>
    </div>
    <div>
        第三行
        <slot name="san"></slot>
    </div>

</template>
```

```
作用域：就是传值

父组件：

<Table>
       <template v-slot:er="scope">
            <span>这是插入的东西222222 {{  scope.row  }} {{  scope.names  }} </span>
       </template>    

        <template #san="scope">
            <span>这是插入的东西333333  {{  scope.row  }} {{  scope.names  }}  </span>
        </template> 
</Table>

子组件：
 
 <template>      
    <div>第一行</div>
    <div>
        第二行
        <slot name="er" :row="headerTitle" :names="name"></slot>
    </div>
    <div>
        第三行
        <slot name="san" :row="headerTitle" :names="name"></slot>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let headerTitle = ref(100);
let name = ref('张三');
</script>
```

3.2 APP.use具体做了什么

```
app.use( 参数1 , ...options 多个参数 )

1. 首先判断插件 参数1 是否是函数

2. 判断Vue是否已注册过这个插件，如果注册过就跳出方法 

3. 如果没有注册就进行注册 ，vue直接调用install方法，在install方法中进行注册 并且传递 vue 这个函数 
```

