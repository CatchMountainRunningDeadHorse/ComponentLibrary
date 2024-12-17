<template>
    <div class="container">
        <div ref="threeRef"></div>
    </div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js"
// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { onBeforeUnmount, onMounted,onUnmounted,ref } from "vue";

const threeRef = ref()

//动画变量
let mixer,clock,stats,renderer,scene,
pmremGenerator,camera,controls,animateID;

onMounted(() => {
    init()
})

const init = () => {
    clock = new THREE.Clock();

    stats = new Stats();
    threeRef.value.appendChild( stats.dom );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    threeRef.value.appendChild( renderer.domElement );

    pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    //场景的颜色
    scene.background = new THREE.Color( 0xbfe3dd );
    // scene - 给定的场景
    // 	sigma - （可选）指定在PMREM生成之前应用于场景的以弧度为单位的模糊半径。默认为0。
    // 	near - （可选）近平面值，默认值为0.1。
    // 	far - （可选）远平面值。默认值为100。
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 1.8 ).texture;

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 5, 2, 8 );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../draco/' );

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.load( '../gltf/LittlestTokyo.glb', function ( gltf ) {

        const model = gltf.scene;
        console.log('11111111111111111111',gltf);
        model.position.set( 1, 1, 0 );
        model.scale.set( 0.01, 0.01, 0.01 );
        scene.add( model );
        //动画混合器
        mixer = new THREE.AnimationMixer( model );
        //返回所传入的剪辑参数
        mixer.clipAction( gltf.animations[ 0 ] ).play();

        animate();

    }, undefined, function ( e ) {

        console.error( e );

    } );
}


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

    animateID = requestAnimationFrame( animate );

    const delta = clock.getDelta();

    mixer.update( delta );

    controls.update();

    stats.update();

    renderer.render( scene, camera );

}

onBeforeUnmount(() => {
    cancelAnimationFrame(animateID)
})
 
</script>


<style>
    .provinceInfo {
      position: absolute;
      z-index: 2;
      background: rgba(148, 121, 121,0.5);
      padding: 10px;
      color:azure;
      visibility: hidden;
    }
</style>