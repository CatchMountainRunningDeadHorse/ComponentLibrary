<template>
    <div ref="three" 
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <div ref="statsDom" class="frameRate"></div>
        <div class="scenes vchsdv" :style="{
            transform: `translate3d(0, ${-height * index}px, 0)`,
        }">
            <div v-for="(item, index) in scenes" :style="{ width: `${width}px`, height: `${height}px` }" :key="index">
                <h1 style="padding: 100px 50px; font-size: 50px; color: #fff;margin: 0;">
                    {{ item.text }}
                </h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Water } from "three/examples/jsm/objects/Water2";
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import Stats from "three/examples/jsm/libs/stats.module.js"
// import Worker from '@/utils/worker.js?worker'
import gsap from "gsap"
import { ref,onMounted, onUnmounted } from 'vue'
    let loading = ref(false)
    const width = window.innerWidth - 200
    const height = window.innerHeight - 60
    const three = ref(null)
    let scene = null
    let renderer = null
    let camera = null
    let Controls = null
    let fov = 75
    let pointLightGroup = null
    let pointLightArr = []
    let radius = 3
    let scenes = ref([
        {
            text: "圣诞快乐",
            callback: () => {
                // 执行函数切换位置
                translateCamera(
                    new THREE.Vector3(-3.23, 3, 4.06),
                    new THREE.Vector3(-8, 2, 0)
                );
            },
        },
        {
            text: "手握日月摘星辰，世间无我这般人",
            callback: () => {
                // 执行函数切
                translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
            },
        },
        {
            text: "一步杀一人，千里不留行",
            callback: () => {
                // 执行函数切
                translateCamera(new THREE.Vector3(10, 3, 0), new THREE.Vector3(5, 2, 0));
            },
        },
        {
            text: "人生得意须尽欢，莫使金樽空对月",
            callback: () => {
                // 执行函数切
                translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
                makeHeart();
            },
        },
        {
            text: "云想衣裳花想容，春风扶栏露华浓",
            callback: () => {
                // 执行函数切
                translateCamera(
                    new THREE.Vector3(-20, 1.3, 6.6),
                    new THREE.Vector3(5, 2, 0)
                );
            },
        },
    ])
    // 使用补间动画移动相机
    let timeLine1 = gsap.timeline()
    let timeline2 = gsap.timeline()
    let index = ref(0)
    let starsInstance = null
    let starsArr = []
    let endArr = []
    let heartShape = null
    const statsDom = ref(null)
    let stats = ref(null)
        
    onMounted(() => {
        initScene()
        initLoader()
        initCamera()
        setSceneAmbient()
        initRenderer()
        initOrbitControls()
        renderFrameRate()
        initWaterFace()
        initPointsGroup()
        watchMouseRoller()
        initSkyFullStars()
        createHeartPath()
        getHeartPathPoint()
        initAnimate()
        onresize()
    })


        function initScene() {
            // 创建3D场景对象Scene
            scene = new THREE.Scene();
        }
        //初始化相机
        function initCamera() {
            //计算相机距离物体的距离
            // const distance = width / 2 / Math.tan(Math.PI / 12)
            // const zAxisNumber = Math.floor(distance - depth / 2)
            camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000)
            //设置相机所在的位置
            camera.position.set(-3.23, 2.98, 4.06)
            //看向原点
            camera.lookAt(0, 0, 0)
        }
        //渲染器
        function initRenderer() {
            renderer = new THREE.WebGLRenderer({
                antialias: true   //设置抗锯齿
            })
            //定义渲染器的尺寸
            renderer.setSize(width, height)
            //设置编码方式和gltf贴图保持一致，解决渲染颜色偏差的问题
            renderer.outputEncoding = THREE.sRGBEncoding
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.5;
            renderer.shadowMap.enabled = true;
            renderer.physicallyCorrectLights = true;
            three.value.appendChild(renderer.domElement)
        }
        //添加轨道控制器
        function initOrbitControls() {
            Controls = new OrbitControls(camera, renderer.domElement)
            // Controls.enabled = true
            Controls.target.set(-8, 2, 0);
            Controls.enableDamping = true
            Controls.update()
        }
        //渲染帧率
        function renderFrameRate(){
            stats.value = new Stats()
            stats.value.domElement.style.position = 'relative'
            stats.value.domElement.style.backgroundColor = 'white'
            statsDom.value.appendChild(stats.value.domElement)
        }


        //添加光源，坐标轴等
        function setSceneAmbient() {
            // 添加平行光
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 50, 0);
            scene.add(light);

            // 添加点光源
            const pointLight = new THREE.PointLight(0xffffff, 50);
            pointLight.position.set(0.1, 2.4, 0);
            pointLight.castShadow = true;
            scene.add(pointLight);
        }
        //动画刷新
        let req;
        function initAnimate() {
            req = requestAnimationFrame(initAnimate)
            TWEEN.update()  //更新tween
            // 更新 Stats
            stats.value.update();
            renderer.render(scene, camera);//渲染操作
        }
        // 使用补间函数，从0到2π，使灯泡旋转
        function intiTween() {
            let tween = new TWEEN.Tween({rotationY:0})
            tween.to({rotationY:Math.PI * 2}, 10000)
                .onUpdate((obj) => {
                    pointLightGroup.rotation.y = obj.rotationY;
                    pointLightArr.forEach((item, index) => {
                        item.position.set(
                            radius * Math.cos((index * 2 * Math.PI) / 3),
                            Math.cos((index * 2 * Math.PI) / 3 + obj.rotationY * 5),
                            radius * Math.sin((index * 2 * Math.PI) / 3)
                        );
                    });
                })
                .repeat(Infinity).start()
        }
        // 初始化loader
        function initLoader() {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("../draco/");

            const Loader = new GLTFLoader()
            Loader.setDRACOLoader(dracoLoader);
            // 加载环境纹理
            let rgbeLoader = new RGBELoader();
            rgbeLoader.load("../hdr/sky.hdr", (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
            });
            // 加载模型
            loading.value = true
            Loader.load('../gltf/scene.glb', function (gltf) {
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.name === "Plane") {
                        child.visible = false;
                    }
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                loading.value = false
                scene.add(model);
            })
        }

        //创建水面
        function initWaterFace() {
            // 创建水面
            const waterGeometry = new THREE.CircleGeometry(300, 32);
            const water = new Water(waterGeometry, {
                textureWidth: 1024,
                textureHeight: 1024,
                color: 0xeeeeff,
                flowDirection: new THREE.Vector2(1, 1),
                scale: 100,
            });
            water.rotation.x = -Math.PI / 2;
            water.position.y = -0.4;
            scene.add(water);
        }
        // 创建点光源组
        function initPointsGroup() {
            pointLightGroup = new THREE.Group();
            pointLightGroup.position.set(-8, 2.5, -1.5);
            pointLightGroup.name = '点光源组'
            for (let i = 0; i < 3; i++) {
                // 创建球体当灯泡
                const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
                const sphereMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 10,
                });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                pointLightArr.push(sphere);
                sphere.position.set(
                    radius * Math.cos((i * 2 * Math.PI) / 3),
                    Math.cos((i * 2 * Math.PI) / 3),
                    radius * Math.sin((i * 2 * Math.PI) / 3)
                );
                let pointLight = new THREE.PointLight(0xffffff, 50);
                sphere.add(pointLight);

                pointLightGroup.add(sphere);
            }
            scene.add(pointLightGroup);
            intiTween()
        }

        // 定义相机移动函数
        function translateCamera(position, target) {
            timeLine1.to(camera.position, {
                x: position.x,
                y: position.y,
                z: position.z,
                duration: 1,
                ease: "power2.inOut",
            });

            timeline2.to(Controls.target, {
                x: target.x,
                y: target.y,
                z: target.z,
                duration: 1,
                ease: "power2.inOut",
            });
        }
        // 监听鼠标滚轮事件
        function watchMouseRoller() {
            let isAnimate = false;
            window.addEventListener(
                "wheel",
                (e) => {
                    if (isAnimate) return;
                    isAnimate = true;
                    if (e.deltaY > 0) {
                        index.value++;
                        if (index.value > scenes.value.length - 1) {
                            index.value = 0;
                            restoreHeart();
                        }
                    }
                    scenes.value[index.value].callback();
                    setTimeout(() => {
                        isAnimate = false;
                    }, 1000);
                },
                false
            );
        }
        // 实例化创建漫天星星
        function initSkyFullStars() {
            starsInstance = new THREE.InstancedMesh(
                new THREE.SphereGeometry(0.1, 32, 32),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 10,
                }),
                100
            );
            // 星星随机到天上
            for (let i = 0; i < 100; i++) {
                let x = Math.random() * 100 - 50;
                let y = Math.random() * 100 - 50;
                let z = Math.random() * 100 - 50;
                starsArr.push(new THREE.Vector3(x, y, z));

                let matrix = new THREE.Matrix4();
                matrix.setPosition(x, y, z);
                starsInstance.setMatrixAt(i, matrix);
            }
            scene.add(starsInstance);
        }
        // 创建爱心路径
        function createHeartPath() {
            heartShape = new THREE.Shape();
            heartShape.moveTo(25, 25);
            heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
            heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
            heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
            heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
            heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
            heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);
        }
        // 根据爱心路径获取点
        function getHeartPathPoint() {
            let center = new THREE.Vector3(0, 2, 10);
            for (let i = 0; i < 100; i++) {
                let point = heartShape.getPoint(i / 100);
                endArr.push(
                    new THREE.Vector3(
                        point.x * 0.1 + center.x,
                        point.y * 0.1 + center.y,
                        center.z
                    )
                );
            }
        }

        // 创建爱心动画
        function makeHeart() {
            let params = {
                time: 0,
            };
            gsap.to(params, {
                time: 1,
                duration: 1,
                onUpdate: () => {
                    for (let i = 0; i < 100; i++) {
                        let x = starsArr[i].x + (endArr[i].x - starsArr[i].x) * params.time;
                        let y = starsArr[i].y + (endArr[i].y - starsArr[i].y) * params.time;
                        let z = starsArr[i].z + (endArr[i].z - starsArr[i].z) * params.time;
                        let matrix = new THREE.Matrix4();
                        matrix.setPosition(x, y, z);
                        starsInstance.setMatrixAt(i, matrix);
                    }
                    starsInstance.instanceMatrix.needsUpdate = true;
                },
            });
        }
        function restoreHeart() {
            let params = {
                time: 0,
            };
            gsap.to(params, {
                time: 1,
                duration: 1,
                onUpdate: () => {
                    for (let i = 0; i < 100; i++) {
                        let x = endArr[i].x + (starsArr[i].x - endArr[i].x) * params.time;
                        let y = endArr[i].y + (starsArr[i].y - endArr[i].y) * params.time;
                        let z = endArr[i].z + (starsArr[i].z - endArr[i].z) * params.time;
                        let matrix = new THREE.Matrix4();
                        matrix.setPosition(x, y, z);
                        starsInstance.setMatrixAt(i, matrix);
                    }
                    starsInstance.instanceMatrix.needsUpdate = true;
                },
            });
        }
        //监听画布的全屏事件
        function onresize() {
            window.onresize = function () {
                renderer.setSize(window.innerWidth - 200, window.innerHeight - 60);
                camera.aspect = (window.innerWidth - 200) / (window.innerHeight - 60);
                camera.updateProjectionMatrix();
            }
        }

        onUnmounted(() => {
            cancelAnimationFrame(req)
        })

</script>

<style>
.vchsdv {
    position: fixed;
    left: 200;
    top: 60;
    z-index: 10;
    pointer-events: none;
    transition: all 1s;
}
.frameRate{
    position: fixed;
    left: 200;
    top: 60;
    z-index: 12;
}
</style>