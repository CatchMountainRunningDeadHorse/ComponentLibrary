<template>
    <div class="container">
        <div ref="three"  
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        ></div>
        <div class="charts left" :class="{ hidden1:store.state.isFullScreen }">
            <div class="item">
                <ThreeDEight/>
            </div>
            
            <div class="item">
                <Map></Map>
            </div>
            
            <div class="item">
                <Hot></Hot>
            </div>
        </div>
        <div class="charts right" :class="{ hidden2:store.state.isFullScreen }">
            <div class="item">
                <!-- <Rank/> -->
                <div class="com-container flex">
                    <el-tag type="danger" :class="['tag-item',selectType === '总览' ? 'selected':'unselected']" @click="selectRobotType('总览')">总览</el-tag>
                    <el-tag v-for="item in modelNameArr" :key="item.name" type="danger" :class="['tag-item',selectType === item.name ? 'selected':'unselected']" @click="selectRobotType(item.name)">{{item.name}}</el-tag>
                </div>
            </div>
            <div class="item">
                <Stock></Stock>
            </div>
                        
            <div class="item">
                <Trend></Trend>
            </div>
        </div>
    </div>
</template>

<script setup>
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import TWEEN from 'three/examples/jsm/libs/tween.module.js'
    import ThreeDEight from "../../ShopMall/components/ThreeDEight.vue";
    import Map from "@/components/Echarts/Map.vue";
    import Hot from "@/components/Echarts/Hot.vue";
    import Rank from "@/components/Echarts/Rank.vue";
    import Stock from "@/components/Echarts/Stock.vue";
    import Trend from "@/components/Echarts/Trend.vue";
    import { onMounted,ref,getCurrentInstance,nextTick, onUnmounted } from "vue";
    import { useStore } from 'vuex';
    const three = ref(null)
    let loading = ref(false)
    let store = useStore()
    const width = window.innerWidth -200
    const height = window.innerHeight - 60
    let scene,req,renderer,camera,Controls,Loader;
    const fov = 90
    const selectType = ref('总览')
    const globalProperties = getCurrentInstance().appContext.config.globalProperties; // 获取全局挂载
    const socket = globalProperties.$socket
    onMounted(() => {
        
        socket.registerCallBack('fullScreen',recvData)
        initScene()
        initLoader()
        initCamera()
        initRenderer()
        initLightAxes()
        createCircle()
        initOrbitControls() 
        initAnimate()
        onresize()
        window.addEventListener("mousewheel",fullScreen)
    })
    onUnmounted(() => {
        window.removeEventListener("mousewheel",fullScreen)
        cancelAnimationFrame(req)
        socket.unRegisterCallBack('fullScreen')
    })
    async function recvData(ret){
        selectType.value = ret.chartName
        group.traverse(function(obj){
            if(obj.name === ret.chartName){
                camera.lookAt(obj.position) 
            }
        })
    }
    function initScene(){
        // 创建3D场景对象Scene
        scene = new THREE.Scene();
    }
    //初始化相机
    function initCamera(){
        camera = new THREE.PerspectiveCamera(fov,width / height,0.1,1000)
        //设置相机所在的位置
        camera.position.set(0,50,200)
        camera.lookAt(0,0,0)
    }
    //渲染器
    function initRenderer(){
        renderer = new THREE.WebGLRenderer({
            antialias:true   //设置抗锯齿
        })
        //定义渲染器的尺寸
        renderer.setSize(width,height)
        three.value.appendChild(renderer.domElement)
    }
    //添加轨道控制器
    function initOrbitControls(){
        Controls = new OrbitControls(camera,renderer.domElement)
        Controls.enableDamping = true
        Controls.update()
    }
    //添加光源、坐标轴等
    function initLightAxes(){
        // let axes = new THREE.AxesHelper(100)
        // axes.position.set(0,3,0)
        // scene.add(axes)

        let light1 = new THREE.DirectionalLight(0xffffff,2)
        light1.position.set(500,30,300)
        let light2 = new THREE.DirectionalLight(0xffffff,2)
        light2.position.set(500,30,-300)
        let light3 = new THREE.DirectionalLight(0xffffff,2)
        light3.position.set(-500,30,300)
        let light4 = new THREE.DirectionalLight(0xffffff,2)
        light4.position.set(-500,30,-300)
        scene.add(light1,light2,light3,light4)
        // scene.add(light1,light2)
    }
    //动画刷新
    let clock = new THREE.Clock()
    function initAnimate(){        
        let t = clock.getElapsedTime() % 20
        t = t / 20
        req = requestAnimationFrame(initAnimate)
        TWEEN.update()  //更新tween
        renderer.render(scene, camera);//渲染操作
        // planeFly(camera,circle,t)
        // Controls.update()
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
    //初始化加载器
    let materialRun = []
    const distance = 30
    let group = new THREE.Group()
    function initLoader(){
        //添加机器人
        //设置解压缩的加载器
        loading.value = true
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("../draco/");
        dracoLoader.setDecoderConfig({type:'js'});

        Loader = new GLTFLoader()
        Loader.setDRACOLoader(dracoLoader);
        console.log('Kcnbsdinfkbndfbno你说的局',new Date());
        Loader.load('../gltf/gc112.glb', function (gltf) {
            console.log('你说的加班费健康不你',new Date());
            gltf.scene.position.y = 3
            gltf.scene.rotateY(Math.PI / 2)
            gltf.scene.scale.set(4,4,4)
            
            cloneModel(gltf.scene,-70,'A')
            
            gltf.scene.rotateY(Math.PI)
            cloneModel(gltf.scene,-20,'B')

            gltf.scene.rotateY(Math.PI)
            cloneModel(gltf.scene,20,'C')

            gltf.scene.rotateY(Math.PI)
            cloneModel(gltf.scene,70,'D')
            loading.value = false
            console.log('速度滑冰复苏规格化',new Date());
            // scene.add(gltf.scene);
        })
        Loader.load('../gltf/gc001.glb', function (gltf) {
            console.log('基本都是VB的健康不你大佛你');
            const textureCube = new THREE.CubeTextureLoader()
                .setPath('../gltf/envMaps/envMaps3/')
                .load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg'])
            gltf.scene.position.set(0,-3,0)
            gltf.scene.traverse(function(obj){
                if(obj.isMesh){
                    obj.material.envMap = textureCube
                    obj.material.envMapIntensity = 1.0
                }
            })
            scene.add(gltf.scene);
            camera.updateProjectionMatrix();
            loading.value = false
        })
    }
    const modelNameArr = ref([])
    function cloneModel(model,positionX,name){
        for(let i=-6; i<6; i++){
            model.position.x = positionX
            let apps = model.clone()
            apps.position.z = distance * i
            apps.name = name + '-' + (i + 6)
            modelNameArr.value.push({name:apps.name})
            if(i !== 3){
                new SpriteText(
                    apps.name,
                    new THREE.Vector3(apps.position.x,apps.position.y+30,apps.position.z),
                    '#00ff00',
                    '#ff0000'
                )
            }else{
                new SpriteText(
                    apps.name,
                    new THREE.Vector3(apps.position.x,apps.position.y+30,apps.position.z),
                    '#ff0000',
                    '#00ff00'
                )
            }
            apps.traverse((obj) => {
                if(obj.name === 'Node_319' && i !== 3){
                    const tween1 = new TWEEN.Tween(obj.position)
                    tween1.to({y:1.77},500)
                    //循环往复
                    tween1.yoyo(true)
                    //设置缓动函数
                    tween1.easing(TWEEN.Easing.Quadratic.InOut)
                    tween1.repeat(Infinity)  //重复次数
                    tween1.start();  //启动补间动画
                }
            })
            group.add(apps)
            scene.add(group);
        }
    }

    let sprite;
    //创建精灵文字
    class SpriteText{
        constructor(text,position,color1,color2){
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = 100
            canvas.height = 100
                context.beginPath()
                context.moveTo(0,0)
                context.lineTo(100,0)
                context.lineTo(50,100)
                context.lineTo(0,0)
                context.fillStyle = color1;
                context.fill()
                context.stroke();
                context.fillStyle = color2;
                context.font = '30px 宋体';
                context.fillText(text, canvas.width / 4, canvas.height / 3,50);
                context.closePath()

                let texture = new THREE.CanvasTexture(canvas)
                const material = new THREE.SpriteMaterial({
                    map:texture,    
                    transparent:true
                })
                sprite = new THREE.Sprite(material)
                sprite.scale.set(5,5,1)
                sprite.position.copy(position)
                sprite = sprite
                scene.add(sprite)
                // isCanvasExist = true
            }
        // }
    }

    function fullScreen(e){
        if(e.deltaY > 0){
            store.commit('setFullScreen',true)
        }else{
            store.commit('setFullScreen',false)
        }
    }

    let circle;
    function createCircle(){
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            150, 250,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        const curvePoints = curve.getPoints( 50 );
        curvePoints.forEach((el) => {
            el.x = el.x
            el.z = el.y
            el.y = 60
        })

        circle = new THREE.CatmullRomCurve3( curvePoints);
        // const points = circle.getPoints( 50 );
        // const geometry = new THREE.BufferGeometry().setFromPoints( points );

        // const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

        // Create the final object to add to the scene
        // const ellipse = new THREE.Line( geometry, material );
        // ellipse.rotateX(Math.PI / 2)
        // ellipse.position.y = 50
        // scene.add(ellipse)
    }

    function planeFly(plane,curve,t){
        //设置飞机飞行路径
        plane.position.copy(curve.getPoint(t))   //getPointAt()
        //设置飞机飞行方向
        // plane.lookAt(0,0,0)
    }

    function selectRobotType(name){
        const abc = {order: "DESC",pageNumber: 1,pageSize: 10,setCode:null,setName: null,setType: null,showMoreSearch: false,sort: "update_time",sourceCode: null}
        socket.send({
            action:'fullScreen',
            socketType:'fullScreen',
            chartName:name,
            value:'#fff'
        })
    }
    
</script>

<style>
    .charts{
        height: 100%;
        width: 500px;
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        /* align-items: center; */
    }
    .left{
        left: 0;
    }
    .right{
        right: 0;
    }
    .item{
        width: 100%;
        height: 33%;
        z-index: 22;
        position: relative;
        box-sizing: border-box;
    }
    .item::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-image: url('/static/img/background.png');
        background-size: 100% 100%;
        opacity: 0.6;
    }
    .hidden1{
        transform: translate(-100%,0);
    }

    .hidden2{
        transform: translate(100%,0);
    }
    .flex{
        display: flex;
        flex-wrap: wrap;
        padding: 50px 10px 20px 20px;
    }
    .tag-item{
        margin: 5px;
    }
    .selected{
        background-color: rgb(14, 230, 79);
        color: #fff;
    }
    .unselected{
        background-color: rgb(231, 7, 7);
        color: #fff;
    }
</style>