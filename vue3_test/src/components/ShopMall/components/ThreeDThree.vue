<template>
    <div>
        <div ref="three">
            <div ref="statsDom" class="frameRate"></div>
        </div>
    </div>
</template>
  
<script setup>
    import * as THREE from 'three'
    // 引入扩展库OrbitControls.js
    // 扩展库引入——旧版本，比如122, 新版本路径addons替换了examples/jsm
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import xingyun from '@/../public/images/xingyun1.jpg'
    import earth from '@/../public/images/earth2.jpg'
    import star1 from '@/../public/images/xingxing2.png'
    import star2 from '@/../public/images/xingxing3.png'
    
    import nebula from '@/../public/images/xingyun2.png'
    import Stats from "three/examples/jsm/libs/stats.module.js"
    import { onMounted,onUnmounted,ref } from 'vue';
    const width = window.innerWidth -200
    const height = window.innerHeight - 60
    const depth = 1400
    const fov = 15 //视野夹角
    let distance = 0  //相机距离物体的距离
    let zAxisNumber = 0 // 相机在z轴上的位置
    let scene = null  //场景
    let geometryData = {  //几何体
        geometry1:null,  // 几何体1
        starBigGeometry:null,  // 几何体2
        starGeometry:null,
    }
    let materialData = {  //材质
        material1:null,  // 材质1
        starBigMaterial:null,  // 材质2
        starMaterial:[],  //点的材质
        cloudmaterial:null
    }
    let meshData = {  //网格
        mesh1:null,
        starBigMesh:null,
        starMesh:null,
        cloudMesh:null
    }
    let camera = null  //相机
    let renderer = null // 渲染器
    let controls = null //轨道控制器
    let parameters = null //点的初始参数
    let particles_init_position = null //初始的位置
    //声明点在z轴上的移动位置
    let zprogress = null
    let zprogress_sceond = null
    let particles_first = []
    let particles_second = []
    let cloudMove_first = null
    let cloudMove_second = null
    let cloud_first = null
    let cloud_second = null
    const three = ref(null)
    const statsDom = ref(null)
    let stats = ref(null)


    onMounted(() => {
        initScene()
        initSceneBg()
        initCamera()
        initSphereModel()
        initLight()
        renderFrameRate()

        //定义初始位置
        particles_init_position = -zAxisNumber - depth / 2
        zprogress = particles_init_position
        zprogress_sceond = particles_init_position * 2
        particles_first = initSceneStar(particles_init_position)
        particles_second = initSceneStar(zprogress_sceond)
        cloud_first = initCloud(400,200)
        cloud_second = initCloud(200,100)
        cloudMove_first = initCloudMove(cloud_first,[
                new THREE.Vector3(-width / 10,0,-depth / 2),
                new THREE.Vector3(-width / 4,height / 8,0),
                new THREE.Vector3(-width / 4,0,zAxisNumber)
            ],0.0002)
            
        cloudMove_second = initCloudMove(cloud_second,[
                new THREE.Vector3(width / 8,height / 8,-depth / 2),
                new THREE.Vector3(width / 8,height / 8,zAxisNumber),
            ],0.0008)
        initRenderer()
        initOrbitControls()
        initAnimate()
        onresize()
    })
    //初始化场景
    function initScene(){
        // 创建3D场景对象Scene
        scene = new THREE.Scene();
        //添加一个雾气的效果
        //线性雾
        scene.fog = new THREE.Fog(0x000000,0,5000)
        //指数雾(参数1：雾的颜色，参数2：定义雾的密度将会增长多块)
        // scene.fog = new THREE.FogExp2(0x000000,0.0002)
    }
    //添加背景
    function initSceneBg(){
        new THREE.TextureLoader().load(xingyun,function(texture){
            //创建立方体
            geometryData.geometry1 = new THREE.BoxGeometry(width,height,depth)
            materialData.material1 = new THREE.MeshBasicMaterial({
                map:texture,
                side:THREE.BackSide
            })
            //网格
            meshData.mesh1 = new THREE.Mesh(geometryData.geometry1,materialData.material1)
            //添加到场景
            scene.add(meshData.mesh1)
        })
    }
    //渲染帧率
    function renderFrameRate(){
        stats.value = new Stats()
        stats.value.domElement.style.position = 'relative'
        stats.value.domElement.style.backgroundColor = 'white'
        statsDom.value.appendChild(stats.value.domElement)
    }
    //初始化相机
    function initCamera(){
        //计算相机距离物体的距离
        distance = width / 2 / Math.tan(Math.PI / 12)
        zAxisNumber = Math.floor(distance - depth / 2)
        camera = new THREE.PerspectiveCamera(fov,width / height,1,8000)
        //设置相机所在的位置
        camera.position.set(0,0,zAxisNumber)
        //看向原点
        camera.lookAt(0,0,0)
    }
    //初始化球体
    function initSphereModel(){
        let that = this
        geometryData.starBigGeometry = new THREE.SphereGeometry(50,64,32)
        materialData.starBigMaterial = new THREE.MeshPhongMaterial()
        materialData.starBigMaterial.map = new THREE.TextureLoader().load(earth)
        //网格
        meshData.starBigMesh = new THREE.Mesh(geometryData.starBigGeometry,materialData.starBigMaterial)
        meshData.starBigMesh.position.set(-400,200,-200)
        scene.add(meshData.starBigMesh)
    }
    //光源
    function initLight(){
        //添加一个环境光
        const ambientLight = new THREE.AmbientLight(0xffffff,1)
        scene.add(ambientLight)
        //添加一个点光源
        const pointLight = new THREE.PointLight(0x0655fd,5,0)
        pointLight.position.set(0,100,-200)
        scene.add(pointLight)
    }
    //星球的自传
    function sphereRotate(){
        meshData.starBigMesh.rotateY(0.002)
    }
    //初始化场景星星的效果
    function initSceneStar(initZposition){
        geometryData.starGeometry = new THREE.BufferGeometry()
        //星星位置的坐标
        const vertices = []
        //创建纹理
        const textureLoader = new THREE.TextureLoader()
        const sprite1 = textureLoader.load(star1)
        const sprite2 = textureLoader.load(star2)
        const pointsGeometry = []
        //声明点的参数
        parameters = [
            [[0.6,100,0.75],sprite1,50],
            [[0,0,1],sprite2,20]
        ]
        //创建1500个星星
        for(let i=0; i<1500; i++){
            const x = THREE.MathUtils.randFloatSpread(width)
            const y = THREE.MathUtils.randFloat(0,height / 2)
            const z = THREE.MathUtils.randFloat(-depth / 2, zAxisNumber)
            vertices.push(x,y,z)
        }
        geometryData.starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))
        //创建两种材质
        for(let i=0; i<parameters.length; i++){
            //颜色
            const color = parameters[i][0]
            //纹理
            const sprite = parameters[i][1]
            //点的大小
            const size = parameters[i][2]

            materialData.starMaterial[i] = new THREE.PointsMaterial({
                size,
                map:sprite,
                blending:THREE.AdditiveBlending,  //
                transparent:true,
                depthTest:true,// 开启深度测试
            })
            materialData.starMaterial[i].color.setHSL(color[0],color[1],color[2])
            //创建物体
            meshData.starMesh = new THREE.Points(geometryData.starGeometry,materialData.starMaterial[i])
            meshData.starMesh.rotation.x = Math.random() * 0.2 -0.15
            meshData.starMesh.rotation.y = Math.random() * 0.2 -0.15
            meshData.starMesh.rotation.z = Math.random() * 0.2 -0.15
            meshData.starMesh.position.setZ(initZposition)
            pointsGeometry.push(meshData.starMesh)
            
            scene.add(meshData.starMesh)
        }
        return pointsGeometry
    }
    //渲染星星的运动
    function renderStarMove(){
        //控制星星颜色的变化
        const time = Date.now() * 0.00005
        for(let i=0; i<parameters.length; i++){
            const color = parameters[i][0]
            const h = ((360 * (color[0] + time)) % 360) / 360  
            materialData.starMaterial[i].color.setHSL(color[0],color[1],parseFloat(h.toFixed(2)))

        }
        //星星的运动
        zprogress += 1
        zprogress_sceond += 1
        if(zprogress >= zAxisNumber + depth / 2){
            zprogress = particles_init_position
        }else{
            particles_first.forEach(item => {
                item.position.setZ(zprogress)
            })
        }

        if(zprogress_sceond >= zAxisNumber + depth / 2){
            zprogress_sceond = particles_init_position
        }else{
            particles_second.forEach(item => {
                item.position.setZ(zprogress_sceond)
            })
        }
    }
    //渲染星云的效果
    function initCloud(width,height){
        const geometry = new THREE.PlaneGeometry(width,height)
        const textureLoader = new THREE.TextureLoader()
        const cloudTexture = textureLoader.load(nebula)
        materialData.cloudmaterial =new THREE.MeshBasicMaterial({
            map:cloudTexture,
            blending:THREE.AdditiveBlending,
            depthTest:false,
            transparent:true
        })
        meshData.cloudMesh = new THREE.Mesh(geometry,materialData.cloudmaterial)
        scene.add(meshData.cloudMesh)
        return meshData.cloudMesh
    }
    //创建星云的运动函数
    function initCloudMove(cloud,route,speed){
        let cloudProgress = 0
        //创建三维曲线
        const curve = new THREE.CatmullRomCurve3(route)
        return () => {
            if(cloudProgress <= 1){
                cloudProgress += speed
                //获取当前位置
                const point = curve.getPoint(cloudProgress)
                if(point && point.x){
                    
                    cloud.position.set(point.x,point.y,point.z)
                }
            }else{
                cloudProgress = 0
            }
        }
    }
    //渲染器
    function initRenderer(){
        renderer = new THREE.WebGLRenderer()
        //定义渲染器的尺寸
        renderer.setSize(width,height)
        three.value.appendChild(renderer.domElement)
    }
    //添加轨道控制器
    function initOrbitControls(){
        controls = new OrbitControls(camera,renderer.domElement)
        controls.enabled = true
        controls.update()
    }
    //动画刷新
    let req;
    function initAnimate(){
        req = requestAnimationFrame(initAnimate)
        sphereRotate()
        renderStarMove()
        cloudMove_first()
        cloudMove_second()
        stats.value.update();  // 更新 Stats
        renderer.render( scene, camera);//渲染操作
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

    onUnmounted(() => {
        cancelAnimationFrame(req)
    })
</script>
  
<style>
    .frameRate{
        position: fixed;
        left: 200;
        top: 60;
        z-index: 12;
    }
</style>
  