<template>
    <div class="container">
        <div ref="three">
            <div class="dbvhjfb">
                <div ref="statsDom" class=""></div>
                <h1>{{ percentage }}</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import * as CANNON from "cannon-es"
    import TWEEN from 'three/examples/jsm/libs/tween.module.js'
    import Stats from "three/examples/jsm/libs/stats.module.js"
    import { onMounted,onUnmounted,ref } from "vue";

    const three = ref(null)
    const width = window.innerWidth -200
    const height = window.innerHeight - 60
    let scene = null
    let renderer = null
    let camera = null
    let Controls = null
    let Loader = null
    const fov = 75
    let ball = null
    let ballBody = null
    let world = null
    let clock = new THREE.Clock()
    let percentage = ref(30)
    const statsDom = ref(null)
    let stats = ref(null)
    let model = null

    onMounted(() => {
        initScene()
        initCamera()
        initRenderer()
        renderFrameRate()
        initLightAxes()
        initPhysiWorld()
        initOrbitControls()
        initLoader()
        initAnimate()
        onresize()
        addEventListener('click',watchClick)
        initTween()
    })
    function initScene(){
        // 创建3D场景对象Scene
        scene = new THREE.Scene();
    }
    //初始化相机
    function initCamera(){
        camera = new THREE.PerspectiveCamera(fov,width / height,0.1,100)
        //设置相机所在的位置
        camera.position.set(4,2,0)
        camera.updateProjectionMatrix();
    }
    //渲染器
    function initRenderer(){
        renderer = new THREE.WebGLRenderer({
            antialias:true,
            //使用对数缓存
            logarithmicDepthBuffer:true
        })
        //定义渲染器的尺寸
        renderer.setSize(width,height)
        //设置色调映射
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        //设置阴影
        renderer.shadowMap.enabled = true
        //设置阴影类型
        renderer.shadowMap.type = THREE.PCFShadowMap
        three.value.appendChild(renderer.domElement)
    }
    //添加轨道控制器
    function initOrbitControls(){
        Controls = new OrbitControls(camera,renderer.domElement)
        //启用阻尼
        Controls.enableDamping = true
    }
    
    //渲染帧率
    function renderFrameRate(){
        stats.value = new Stats()
        stats.value.domElement.style.position = 'relative'
        stats.value.domElement.style.backgroundColor = 'white'
        statsDom.value.appendChild(stats.value.domElement)
    }
    //添加光源、坐标轴等
    function initLightAxes(){
        let light = new THREE.SpotLight(0xffffff)
        light.position.set(10,50,0)
        light.castShadow = true
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 500
        light.shadow.camera.fov = 30
        light.shadow.bias = -0.00008
        light.intensity = 2
        scene.add(light)
    }
    //初始化物理世界
    function initPhysiWorld(){
        world = new CANNON.World()
        //设置重力
        world.gravity.set(0,-9.82,0)
    }
    //动画刷新
    let req;
    function initAnimate(){
        let delta = clock.getDelta()
        world.step(delta)
        if(ball && ballBody){
            ball.position.copy(ballBody.position)
            ball.quaternion.copy(ballBody.quaternion)
        }
        Controls.update()
        TWEEN.update()
        stats.value.update(); // 更新 Stats
        renderer.render(scene, camera);//渲染操作
        req = requestAnimationFrame(initAnimate)
    }
    //监听画布的全屏事件
    function onresize(){
        window.onresize = function(){
            renderer.setSize(window.innerWidth -200,window.innerHeight - 60);
            camera.aspect = (window.innerWidth -200) / (window.innerHeight - 60);
            camera.updateProjectionMatrix();
        }
    }
    //初始化加载器
    function initLoader(){
        //加载纹理
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load('../images/outdoor.jpg',(texture)=>{
            texture.mapping = THREE.EquirectangularReflectionMapping
            scene.background = texture
            scene.environment = texture
            scene.backgroundBlurriness = 0.3
        })
        // //设置解压缩的加载器
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("../draco/");

        Loader = new GLTFLoader()
        Loader.setDRACOLoader(dracoLoader);

        Loader.load('../gltf/playground02.glb',(gltf) => {
            model = gltf.scene
            model.traverse((obj) =>{
                if(obj.isMesh && obj.name.search(/Solid/) === -1){
                    obj.castShadow = true
                    obj.receiveShadow = true

                    //trimesh类型
                    const trimesh = new CANNON.Trimesh(
                        obj.geometry.attributes.position.array,
                        obj.geometry.index.array
                    )
                    //创建刚体
                    const trimeshBody = new CANNON.Body({
                        mass:0,
                        shape:trimesh
                    })
                    //获取世界位置和旋转给到物理世界
                    trimeshBody.position.copy(obj.getWorldPosition(new THREE.Vector3()))
                    trimeshBody.quaternion.copy(obj.getWorldQuaternion(new THREE.Quaternion()))
                    //添加刚体到物理世界
                    world.addBody(trimeshBody)
                    if(obj.name === 'door'){
                        obj.material = new THREE.MeshBasicMaterial({
                            color:0x000000,
                            opacity:0,
                            transparent:true
                        })
                    }
                }
                if(obj.name === 'Soccer_Ball'){
                    ball = obj
                    const ballShape = new CANNON.Sphere(0.15)
                    ballBody = new CANNON.Body({
                        mass:1,
                        position:new CANNON.Vec3(0,0,0),
                        shape:ballShape
                    })
                    //添加到刚体物理世界
                    world.addBody(ballBody)
                }
                setTimeout(() => {
                    ballBody.position.set(0,0,0)
                    ballBody.velocity.set(0,0,0)
                    ballBody.angularVelocity.set(0,0,0)
                }, 2000);
            })
            scene.add(model);
        })
    }
    function watchClick(event){
        // 获取特定区域的DOM元素
        const targetArea = three.value
        if(targetArea == undefined){
            return
        }
        // 检查点击事件是否发生在特定区域内
        if (event.target === targetArea || targetArea.contains(event.target)) {
            const px = event.offsetX
            const py = event.offsetY
            const x = (px/(window.innerWidth -200)) * 2 - 1
            const y = -(py/(window.innerHeight -60)) * 2 + 1
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(new THREE.Vector2(x,y),camera)
            const intersects = raycaster.intersectObjects([model])
            if (intersects[0].object.name  === 'Solid' || intersects[0].object.name  === 'Solid_1') {
                ballBody.applyForce(
                    new CANNON.Vec3(
                        -10 * percentage.value,
                        6 * percentage.value,
                        (Math.random() - 0.5) * percentage.value
                    ),
                    ballBody.position
                )
                setTimeout(() => {
                    ballBody.position.set(0,0,0)
                    ballBody.velocity.set(0,0,0)
                    ballBody.angularVelocity.set(0,0,0)
                }, 5000);
            }
        }
    }
    function initTween(){
        const tween = new TWEEN.Tween({percentage:0})
        tween.to({percentage:100},5000)
            .onUpdate((obj)=>{
                percentage.value = Math.floor(obj.percentage)
            })
            .repeat(Infinity)
            .start()
    }
    onUnmounted(() => {
        removeEventListener('click',watchClick)
        cancelAnimationFrame(req)
    })
</script>

<style>
    .dbvhjfb{
        position: fixed;
        z-index: 10;
    }
</style>