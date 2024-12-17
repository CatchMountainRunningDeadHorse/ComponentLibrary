<template>
    <div class="container">
        <div ref="three"  
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-button type="primary" class="frameRate" @click="changeenvMap">切换环境</el-button>
        </div>
    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
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
    const fov = 45
    const envMapList = ['../gltf/envMaps/envMaps1/','../gltf/envMaps/envMaps2/','../gltf/envMaps/envMaps3/']
    let index = 0
    onMounted(() => {
        initScene()
        initLoader()
        initCamera()
        initRenderer()
        // initLightAxes()
        initOrbitControls()
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
        light1.position.set(100,100,100)
        let light2 = new THREE.DirectionalLight(0xffffff,1)
        light2.position.set(100,100,-100)
        let light3 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(100,-100,100)
        let light4 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(100,-100,-100)
        let light5 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(-100,-100,-100)
        let light6 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(-100,-100,100)
        let light7 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(-100,100,-100)
        let light8 = new THREE.DirectionalLight(0xffffff,1)
        light3.position.set(-100,100,100)
        scene.add(light1,light2,light3,light4,light5,light6,light7,light8)
    }
    //动画刷新
    let req;
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
    //初始化加载器
    function initLoader(){
        //添加机器人
        //设置解压缩的加载器
        loading.value = true
        const textureCube = new THREE.CubeTextureLoader()
            .setPath(envMapList[index])
            .load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg'])
            
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("../draco/");
        Loader = new GLTFLoader()
        Loader.setDRACOLoader(dracoLoader);

        Loader.load('../gltf/12131.glb', function (gltf) {
            console.log('22222222222222222222222',gltf);
            gltf.scene.traverse(function(obj){
                if(obj.isMesh){
                    obj.material.envMap = textureCube
                    obj.material.envMapIntensity = 1.0
                }
            })
            const model = gltf.scene
            // model.position.set(3,0,0)
            scene.add(model);
            loading.value = false
        })
    }
    function changeenvMap(){
        index += 1
        if(index > 2){
            index = 0
        }
        const textureCube = new THREE.CubeTextureLoader()
            .setPath(envMapList[index])
            .load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg'])
        scene.traverse(function(obj){
            if(obj.isMesh){
                obj.material.envMap = textureCube
                obj.material.envMapIntensity = 1.0
            }
        })
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