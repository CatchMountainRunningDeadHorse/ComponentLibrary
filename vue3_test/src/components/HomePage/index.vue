<template>
    <div class="f-box">
            <div ref="fDiv" class="three-box"></div>
          </div>
</template>
    
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
// 导入three.js.
import * as THREE from "three";
// 导入轨道控制器.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const fDiv = ref(null);

const createScene = () => {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建几何体
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    // 材质对象
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000, // 红色;
    //   transparent: true,
    //   opacity: 0.5,
    // });

    // 创建受光源影响的材质
    const material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
    });

    // 创建网格模型
    const mesh = new THREE.Mesh(geometry, material);
    // 设置网格模型的位置.
    mesh.position.set(0, 0, 0);
    // 物体添加到场景中.
    scene.add(mesh);

    // 创建三维坐标轴.
    const axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);

    // 创建光源
    const pointLight = new THREE.PointLight(0xffffff, 10.0);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    const width = 800;
    const height = 500;
    // 创建一个透视投影相机对象. fov: 代表竖直方向的角度;
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2000);
    // 设置相机得位置.
    camera.position.set(200, 200, 200);
    // 定义相机得视线.
    // camera.lookAt(0, 0, 0); //  观察坐标原点.
    camera.lookAt(mesh.position);

    // 实例化渲染器对象.
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    renderer.render(scene, camera); // 传入哪个场景和摄像头. 会生成canvas画布.
    // domElement获得生成的canvas画布
    fDiv.value.appendChild(renderer.domElement);
    // 第一个参数是改变相机，第二个是监控哪个范围(canvas画布)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => {
        renderer.render(scene, camera);
    });
};

onMounted(() => {
    createScene();
});
onUnmounted(() => {
    

})
</script>
    
<style>
.f-box {
    width: 100%;
    height: 100vh;

   
}
.three-box {
        width: 800px;
        height: 500px;
    }
</style>
