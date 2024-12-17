<template>
  <div class="home">
    <div ref="three">
      <div ref="statsDom" class="frameRate"></div>
    </div>
    <div class="home-content">
      <div class="home-content-title">
        <h1>汽车展示与选配</h1>
      </div>
      <div v-for="(item1, index1) in options" :key="index1">
        <h2>{{ item1.text }}</h2>
        <div class="select">
          <div
            class="select-item"
            v-for="(item, index) in item1.label"
            :key="index"
            @click="item1.onClick(index, item1.label)"
          >
            <div
              class="select-item-color"
              v-if="item1.desc === 'color'"
              :style="{ backgroundColor: item }"
            ></div>
            <el-button
              type="info"
              v-else-if="item1.desc === 'material'"
              round
              >{{ item.name }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Stats from "three/examples/jsm/libs/stats.module.js";
// import gsap from "gsap";
import { onMounted, ref, onUnmounted } from "vue";
//普通变量声明
const width = window.innerWidth - 200;
const height = window.innerHeight - 60;
const trunks = [];
let three = ref();
let scene,
  renderer,
  camera,
  Controls,
  Loader,
  carBody,
  frontCar,
  hoodCar,
  glassCar,
  bodyMaterial,
  frontMaterial,
  hoodMaterial,
  wheelsMaterial,
  glassMaterial,
  req;
const fov = 75;
let wheels = [];
const statsDom = ref(null);
let stats = ref(null);
const options = ref([
  {
    text: "选择车身颜色",
    label: ["red", "blue", "green", "gray", "orange", "purple"],
    desc: "color",
    onClick: (index, data) => {
      selectColor(index, data);
    },
  },
  {
    text: "选择贴膜材质",
    label: [
      { name: "磨砂", value: 1 },
      { name: "冰晶", value: 0 },
    ],
    desc: "material",
    onClick: (index, data) => {
      selectMaterial(index, data);
    },
  },
]);

onMounted(() => {
  initScene();
  initCamera();
  initMaterial();
  renderFrameRate();
  setSceneAmbient();
  initRenderer();
  initBackGround();
  initOrbitControls();
  initLoader();
  initAnimate();
  onresize();
});
onUnmounted(() => {
  destroyThreejs();
});
function initScene() {
  // 创建3D场景对象Scene
  scene = new THREE.Scene();
}
function initMaterial() {
  bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  frontMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  hoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  });
  glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    transmission: 1,
    metalness: 0,
    roughness: 0,
  });
}
//初始化相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  //设置相机所在的位置
  camera.position.set(0, 2, 6);
}
//渲染器
function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true, //设置抗锯齿
  });
  //定义渲染器的尺寸
  renderer.setSize(width, height);
  //设置编码方式和gltf贴图保持一致，解决渲染颜色偏差的问题
  // renderer.outputEncoding = THREE.sRGBEncoding
  //渲染背景
  renderer.setClearColor("#000");
  scene.background = new THREE.Color(0xcccccc);
  scene.environment = new THREE.Color(0xcccccc);
  three.value.appendChild(renderer.domElement);
}
//添加网格地面
function initBackGround() {
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
}
//添加轨道控制器
function initOrbitControls() {
  Controls = new OrbitControls(camera, renderer.domElement);
  // Controls.target.set(-8, 2, 0);
  Controls.enableDamping = true;
  Controls.update();
}
//渲染帧率
function renderFrameRate() {
  stats.value = new Stats();
  stats.value.domElement.style.position = "relative";
  stats.value.domElement.style.backgroundColor = "white";
  statsDom.value.appendChild(stats.value.domElement);
}

//添加光源，坐标轴等
function setSceneAmbient() {
  // 添加平行光
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 0, 10);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  const light5 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 10, 0);
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
  light5.position.set(5, 10, 0);
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
  light6.position.set(0, 10, 5);
  scene.add(light7);
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
  light7.position.set(0, 10, -5);
  scene.add(light8);
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
  light8.position.set(-5, 10, 0);
  scene.add(light9);
  const lightxjc = new THREE.PointLight(0xffffff, 10);
  lightxjc.position.set(0, 0, 50);
  scene.add(lightxjc);
}
//动画刷新
function initAnimate() {
  req = requestAnimationFrame(initAnimate);
  Controls !== null && Controls.update();
  stats.value.update(); // 更新 Stats
  renderer.render(scene, camera); //渲染操作
}
// 初始化loader
function initLoader() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("../draco/");

  Loader = new GLTFLoader();
  Loader.setDRACOLoader(dracoLoader);
  // 加载模型
  Loader.load("../gltf/car.glb", function (gltf) {
    const model = gltf.scene;
    model.traverse((obj) => {
      //判断是否是轮毂
      if (obj.isMesh && obj.name.includes("轮毂")) {
        obj.material = wheelsMaterial;
        wheels.push(obj);
      }
      //判断是否是车身
      if (obj.isMesh && obj.name.includes("Mesh002")) {
        obj.material = bodyMaterial;
        carBody = obj;
      }
      //判断是否是前脸
      if (obj.isMesh && obj.name.includes("前脸")) {
        obj.material = frontMaterial;
        frontCar = obj;
      }
      //判断是否是引擎盖
      if (obj.isMesh && obj.name.includes("引擎盖_1")) {
        obj.material = hoodMaterial;
        hoodCar = obj;
      }
      //判断是否是挡风玻璃
      if (obj.isMesh && obj.name.includes("挡风玻璃")) {
        obj.material = glassMaterial;
        glassCar = obj;
      }
    });
    scene.add(model);
  });
}
//颜色选择函数
function selectColor(index, data) {
  bodyMaterial.color.set(data[index]),
    frontMaterial.color.set(data[index]),
    hoodMaterial.color.set(data[index]),
    wheelsMaterial.color.set(data[index]);
}
function selectMaterial(index, data) {
  (bodyMaterial.clearcoatRoughness = data[index].value),
    (frontMaterial.clearcoatRoughness = data[index].value),
    (hoodMaterial.clearcoatRoughness = data[index].value);
}
//监听画布的全屏事件
function onresize() {
  window.onresize = function () {
    renderer.setSize(window.innerWidth - 200, window.innerHeight - 60);
    camera.aspect = (window.innerWidth - 200) / (window.innerHeight - 60);
    camera.updateProjectionMatrix();
  };
}
// 销毁threejs
function destroyThreejs() {
  try {
    cancelAnimationFrame(req); // animationFrameId = requestAnimationFrame(this.render);
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.content = null;
    let gl = renderer.domElement.getContext("webgl");
    if (gl && gl.getExtension("WEBGL_lose_context")) {
      gl.getExtension("WEBGL_lose_context").loseContext();
    }
    renderer = null;
    camera = null;
    scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });
    scene = null;
    Controls = null;
  } catch (e) {
    console.error("Failed to destroy threejs", e);
  }
}
</script>

<style>
.home-content {
  position: fixed;
  right: 20px;
  top: 60px;
  z-index: 10;
}
.select-item-color {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}
.select {
  display: flex;
}
.select-item-text {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}
.frameRate {
  position: fixed;
  left: 200;
  top: 60;
  z-index: 12;
}
</style>