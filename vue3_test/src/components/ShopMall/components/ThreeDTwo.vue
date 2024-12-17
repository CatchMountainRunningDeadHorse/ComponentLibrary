
<template>
    <div class="home">
        <div ref="three"></div>
        <div class="dbvhjfb">
            <h4>移动摄像机</h4>
            <div class="select">
                <div class="select-item" v-for="(item,index) in options1" :key="index" @click.stop="item.onClick">
                    <el-button class="select-item-text" size="small" round>{{ item.name }}</el-button>
                </div>
            </div>
            <h4>移动摄像机视野中心点</h4>
            <div class="select">
                <div class="select-item" v-for="(item,index) in options2" :key="index" @click.stop="item.onClick">
                    <el-button class="select-item-text" type="info" size="small" round>{{ item.name }}</el-button>
                </div>
            </div>
        </div>
    </div>
  </template>
  
<script setup>
    import * as THREE from 'three'
    // 引入扩展库OrbitControls.js
    // 扩展库引入——旧版本，比如122, 新版本路径addons替换了examples/jsm
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    //引入 gltf 加载器
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
    import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
    import TWEEN from 'three/examples/jsm/libs/tween.module.js'
    import { onMounted,onUnmounted,ref } from 'vue';
    const three = ref(null)
    const width = window.innerWidth -200
    const height = window.innerHeight - 60
    let scene = null
    let model = null
    let renderer = null
    let camera = null
    let Controls = null
    const fov = 35
    const originPosition = new THREE.Vector3(200,0,0)
    const currentLookAt = new THREE.Vector3(0,0,0)
    const originLookAt = new THREE.Vector3(0,0,0)
    let isAnimate = false
    const options1 = [
        {name:'向上',onClick:()=>{cameraMove('up')}},
        {name:'向下',onClick:()=>{cameraMove('down')}},
        {name:'向前',onClick:()=>{cameraMove('front')}},
        {name:'向后',onClick:()=>{cameraMove('back')}},
        {name:'向左',onClick:()=>{cameraMove('left')}},
        {name:'向右',onClick:()=>{cameraMove('right')}},
    ]
    const options2 = [
        {name:'向上',onClick:()=>{cameraLookAtMove('up')}},
        {name:'向下',onClick:()=>{cameraLookAtMove('down')}},
        {name:'向前',onClick:()=>{cameraLookAtMove('front')}},
        {name:'向后',onClick:()=>{cameraLookAtMove('back')}},
        {name:'向左',onClick:()=>{cameraLookAtMove('left')}},
        {name:'向右',onClick:()=>{cameraLookAtMove('right')}},
    ]
    const guiParams = {
        lookAtX: 0,
        lookAtY: 0,
        lookAtZ: 0,
    }
    let isMouseMove = false
    let gui = null
    let isCanvasExist = false
    let sprite = null
    // let infoList = ['../images/earth.jpg','../images/xingyun3.jpg']
    // let Index = false
    onMounted(() => {
        initScene()
        initCamera()
        setSceneAmbient()
        initRenderer()
        initOrbitControls()
        initLoader()
        initAnimate()
        onresize()
        addEventListener('mousedown',() => {
            isMouseMove = false
        })
        addEventListener('mouseup',(event) => {
            if(!isMouseMove){
                if(isCanvasExist){
                    scene.remove(sprite)
                }
                watchClick(event)
            }
        })
        addEventListener('mousemove',() => {
            isMouseMove = true
        })
        initGui()
    })
    function initScene(){
        // 创建3D场景对象Scene
        scene = new THREE.Scene();
        //创建一个组对象
        model = new THREE.Group();
    }
    //初始化相机
    function initCamera(){
        //计算相机距离物体的距离
        // const distance = width / 2 / Math.tan(Math.PI / 12)
        // const zAxisNumber = Math.floor(distance - depth / 2)
        camera = new THREE.PerspectiveCamera(fov,width / height,1,3000)
        //设置相机所在的位置
        camera.position.set(200,0,0)
        camera.lookAt(0,0,0)
    }
    //渲染器
    function initRenderer(){
        renderer = new THREE.WebGLRenderer()
        //定义渲染器的尺寸
        renderer.setSize(width,height)
        //设置编码方式和gltf贴图保持一致，解决渲染颜色偏差的问题
        renderer.outputEncoding = THREE.sRGBEncoding
        three.value.appendChild(renderer.domElement)
    }
    //添加轨道控制器
    function initOrbitControls(){
        Controls = new OrbitControls(camera,renderer.domElement)
        Controls.enabled = true
        Controls.update()
    }
    //实例化 GUI
    function initGui(){
        gui = new GUI()
        gui.domElement.style.top = '60px'

        const cameraFolder = gui.addFolder('相机位置')
        cameraFolder.close()
        cameraFolder.add(camera.position,'x',-150,200).name('前后')
        cameraFolder.add(camera.position,'y',0,150).name('上下')
        cameraFolder.add(camera.position,'z',-150,150).name('左右')


        // 创建一个对象用于存储参数
        const cameraCenterPoint = gui.addFolder('相机视野的中心位置')
        cameraCenterPoint.close()
        cameraCenterPoint.add(guiParams,'lookAtX',-150,150).name('前后').onChange(updateLookAt)
        cameraCenterPoint.add(guiParams,'lookAtY',-150,150).name('上下').onChange(updateLookAt)
        cameraCenterPoint.add(guiParams,'lookAtZ',-150,150).name('左右').onChange(updateLookAt)
    }
    // 更新相机的lookAt位置
    function updateLookAt() {
        camera.lookAt(new THREE.Vector3(guiParams.lookAtX, guiParams.lookAtY, guiParams.lookAtZ));
    }
    //添加光源，坐标轴等
    function setSceneAmbient(){
        // //添加一个环境光
        // const ambient = new THREE.AmbientLight(0xffffff,0.5)
        // scene.add(ambient); 
        // //添加一个点光源
        // const PointLight = new THREE.PointLight(0xffffff,1)
        // PointLight.position.set(1000,2000,1000)
        // scene.add(PointLight)
    }
    //动画刷新
    let req;
    function initAnimate(){
        // 清除之前的渲染
        renderer.clear();
        req = requestAnimationFrame(initAnimate)
        TWEEN.update()  //更新tween
        renderer.render(scene, camera);//渲染操作
    }
    //补间动画
    function intiTween(position,target){
        const tweenCamera = new TWEEN.Tween(camera.position)
        const tweenLookAt = new TWEEN.Tween(currentLookAt)
        tweenCamera.to(position,500)
            // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
            .start()
        tweenLookAt.to(target,500)
            .onUpdate((obj) => {
                Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                camera.lookAt(obj.x,obj.y,obj.z)
            })
            // .yoyo(true)  //循环往复
            // .easing(TWEEN.Easing.Quadratic.InOut)    //设置缓动函数
            // .repeat(Infinity) //重复次数
            .start()
    }
    function initLoader(){
        //CubTexture表示立方体纹理对象，父类是纹理对象 Texture
        //在没有光源的情况下，使用纹理贴图，也可以看得见物体
        const textureCube = new THREE.CubeTextureLoader()
            .setPath('../gltf/envMaps/envMaps1/')
            .load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg'])

        //实例化一个加载器对象
        const Loader = new GLTFLoader()
        Loader.load('../gltf/gc.glb',function(gltf){
            //递归遍历批量设置环境贴图
            gltf.scene.traverse(function(obj){
                if(obj.isMesh){
                    obj.material.envMap = textureCube
                    obj.material.envMapIntensity = 1.0
                }
            })
            model.add(gltf.scene)
            camera.updateProjectionMatrix();
            scene.add( model)
        })
            
    }
    //监听画布的全屏事件
    function onresize(){
        let that = this
        window.onresize = function(){
            renderer.setSize(window.innerWidth -200,window.innerHeight - 60);
            camera.aspect = (window.innerWidth -200) / (window.innerHeight - 60);
            camera.updateProjectionMatrix();
        }
    }
    function cameraMove(direct){
        const tweenCamera = new TWEEN.Tween(camera.position)
        if(direct === 'up'){
            tweenCamera.to({y:camera.position.y+5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'down'){
            tweenCamera.to({y:camera.position.y-5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'front'){
            tweenCamera.to({z:camera.position.z-5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'back'){
            tweenCamera.to({z:camera.position.z+5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'left'){
            tweenCamera.to({x:camera.position.x-5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else{
            tweenCamera.to({x:camera.position.x+5},500)
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }
    }
    function cameraLookAtMove(direct){
        const tweenLookAt = new TWEEN.Tween(currentLookAt)
        if(direct === 'up'){
            tweenLookAt.to({y:currentLookAt.y+5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'down'){
            tweenLookAt.to({y:currentLookAt.y-5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'front'){
            tweenLookAt.to({z:currentLookAt.z-5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'back'){
            tweenLookAt.to({z:currentLookAt.z+5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else if(direct === 'left'){
            tweenLookAt.to({x:currentLookAt.x-5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }else{
            tweenLookAt.to({x:currentLookAt.x+5},500)
                                .onUpdate((obj) => {
                                    Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                                    camera.lookAt(obj.x,obj.y,obj.z)
                                })
                                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                                .start()
        }
    }
    // 定义相机移动函数  (基于gsap的补间动画)
    function translateCamera(position, target) {
        const tweenCamera = new TWEEN.Tween(camera.position)
        tweenCamera.to(position,500).start()
        
        const tweenLookAt = new TWEEN.Tween(currentLookAt)
        tweenLookAt.to(target,500)
            .onUpdate((obj) => {
                Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                camera.lookAt(obj.x,obj.y,obj.z)
            })
            // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
            .start()
    }
    function watchClick(event){
        // 获取特定区域的DOM元素
        const targetArea = three.value
        if(targetArea == undefined){
            return
        }
        // 检查点击事件是否发生在特定区域内
        if (event.target === targetArea || targetArea.contains(event.target)) {
            // 处理在特定区域内的点击事件
            const px = event.offsetX
            const py = event.offsetY
            const x = (px/(window.innerWidth -200)) * 2 - 1
            const y = -(py/(window.innerHeight -60)) * 2 + 1
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(new THREE.Vector2(x,y),camera)
            const intersects = raycaster.intersectObjects([model])
            
            if (intersects.length > 0) {
                // 获取选中模型的数据
                isAnimate = true
                var selectedObject = intersects[0].point;
                intiTween(new THREE.Vector3(50,50,50),selectedObject)
                new SpriteText(intersects[0].name,new THREE.Vector3(selectedObject.x,selectedObject.y+5,selectedObject.z))
            }
        }
    }

    function watchMouseWheel(event){
        if (!isAnimate) {
            return;
        }
        // 阻止默认滚动行为
        // event.preventDefault();
        intiTween(originPosition,originLookAt)
        isAnimate = false
    }

    //创建精灵文字
    class SpriteText{
        constructor(text,position){
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            context.clearRect(0,0,canvas.width,canvas.height)
            const img = new Image()
            img.src = '../images/gcbakImage.png'
            let person = [
                { name: '李四', sex: '男' },
                // { name: '张三', sex: '男' },
                // { name: '王五', sex: '女' }
            ]
            const fontSize = 100
            let y = 250;  //文本内容的初始位置
            img.onload = function() {
                canvas.width = img.width
                canvas.height = img.height
                context.drawImage(img,0,0,img.width,img.height)
                context.font = `${fontSize}px Georgia`;
                context.textAlign = "center"
                person.forEach((el,index) => {
                    // 格式化文本
                    var nameText = `姓名: ${el.name}`;
                    var sexText = `性别: ${el.sex}`;
                    var yPosition = y + index * (fontSize + 20); // 控制每行的垂直位置
                    // 在画布上绘制文本
                    context.fillText(nameText, canvas.width / 2, yPosition);
                    // 在画布上绘制文本
                    context.fillText(sexText, canvas.width / 2, yPosition + 120);
                })

                context.beginPath()

                context.moveTo(200,300)
                //三次贝赛尔曲线
                context.quadraticCurveTo(150,300,150,200)
                context.quadraticCurveTo(150,100,300,100)
                context.quadraticCurveTo(450,100,450,200)
                context.quadraticCurveTo(450,300,250,300)
                context.quadraticCurveTo(250,350,150,350)
                context.quadraticCurveTo(200,350,200,300)
                context.stroke()

                context.closePath()

                let texture = new THREE.CanvasTexture(canvas)
                const material = new THREE.SpriteMaterial({
                    map:texture,    
                    transparent:true
                })
                sprite = new THREE.Sprite(material)
                sprite.scale.set(10,10,1)
                sprite.position.copy(position)
                this.sprite = sprite
                scene.add(sprite)
                isCanvasExist = true
            }
        }
    }

    // class SpriteText{
    //     constructor(text,position){
    //         const canvas = document.createElement('vue-canvas-poster')
    //         canvas.widthPixels = 0
    //         canvas.painting = painting
    //         let texture = new THREE.CanvasTexture(canvas)
    //         const material = new THREE.SpriteMaterial({
    //             map:texture,    
    //             transparent:true
    //         })
    //         sprite = new THREE.Sprite(material)
    //         sprite.scale.set(10,10,1)
    //         sprite.position.copy(position)
    //         this.sprite = sprite
    //         scene.add(sprite)
    //         isCanvasExist = true
    //     }
    // }

    onUnmounted(() => {
        if (gui) {
            gui.destroy();
        }
        removeEventListener('click',watchClick)
        removeEventListener('wheel',watchMouseWheel)
        cancelAnimationFrame(req)
    })

    
  </script>
  
  <style>
    .dbvhjfb{
        width: 410px;
        position: absolute;
        top: 60px;
        display: flex;
        flex-direction: column;
    }
    .select{
        display: flex;
    }
    .select-item-text{
        border: 1px solid #ccc;
        margin: 10px;
        display: inline-block;
        cursor: pointer;
        border-radius: 10px;
    }
  </style>
  