<template>
    <div class="container">
        <div ref="three"  
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        ></div>
    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";
import { onMounted,onUnmounted,ref } from "vue";
    const three = ref(null)
    let loading = ref(false)
    const width = window.innerWidth -200
    const height = window.innerHeight - 60
    let scene = null
    let renderer = null
    let camera = null
    let Controls = null
    let Loader = null
    let req;
    const fov = 45
    onMounted(() => {
        initScene()
        initLoader()
        initBattleForm()
        initCamera()
        dghcvshdvb()
        initRenderer()
        initLightAxes()
        initOrbitControls()
        initBattleForm()
        initGlassReflect()
        initAnimate()
        onresize()
    })
    function initScene(){
        // 创建3D场景对象Scene
        scene = new THREE.Scene();
    }
    //初始化相机
    function initCamera(){
        camera = new THREE.PerspectiveCamera(fov,width / height,0.1,1000)
        //设置相机所在的位置
        camera.position.set(3,3,10)
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
        Controls = new OrbitControls(camera,renderer.domElement)
        Controls.enableDamping = true
        Controls.update()
    }
    //添加光源、坐标轴等
    function initLightAxes(){
        let axes = new THREE.AxesHelper(5)
        scene.add(axes)

        let light1 = new THREE.DirectionalLight(0xffffff,1)
        light1.position.set(0,10,10)
        let light2 = new THREE.DirectionalLight(0xffffff,1)
        light2.position.set(0,10,-10)
        let light3 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(10,10,10)
        scene.add(light1,light2,light3)
    }
    //动画刷新
    function initAnimate(){
        req = requestAnimationFrame(initAnimate)
        renderer.render(scene, camera);//渲染操作
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
    function dghcvshdvb(){
        let hdrLoader = new RGBELoader();
        hdrLoader.load('../hdr/sky12.hdr',(texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            scene.background = texture
            scene.environment = texture
        })
    }
    //初始化加载器
    function initLoader(){
        //添加机器人
        //设置解压缩的加载器
        loading.value = true
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("../draco/");
        dracoLoader.setDecoderConfig({type:'js'});

        Loader = new GLTFLoader()
        Loader.setDRACOLoader(dracoLoader);

        Loader.load('../gltf/bawanglong.glb', function (gltf) {
            scene.add(gltf.scene);
            loading.value = false
        })
    }
    //添加光阵
    function initBattleForm(){
        let video = document.createElement('video')
        video.src = "../mp4File/zp2.mp4"
        video.loop = true
        video.muted = true
        video.play()
        let videoTexture = new THREE.VideoTexture(video)
        const videoGeoPlane = new THREE.PlaneGeometry(8,4.5)

        const videoMaterial = new THREE.MeshBasicMaterial({
            map:videoTexture,
            transparent:true,
            side:THREE.DoubleSide,
            alphaMap:videoTexture
        })
        const videoMesh = new THREE.Mesh(videoGeoPlane,videoMaterial)
        videoMesh.position.set(0,0.2,0)
        videoMesh.rotation.set(-Math.PI / 2, 0, 0)
        scene.add(videoMesh)
    }
    //添加镜面反射
    function initGlassReflect(){
        let reflectorGeometry = new THREE.PlaneGeometry(100,100)
        let reflectorPlane = new Reflector(reflectorGeometry,{
            textureWidth:window.innerWidth -200,
            textureHeight:window.innerHeight -60,
            color:0x332222,
        })
        reflectorPlane.rotation.x = -Math.PI / 2
        scene.add(reflectorPlane)
    }

    onUnmounted(() => {
        cancelAnimationFrame(req)
    })
</script>

<style>
</style>