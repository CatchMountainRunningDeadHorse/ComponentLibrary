<template>
    <div class="container">
        <div ref="three"></div>
    </div>
</template>

<script setup>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { onMounted,ref,onUnmounted } from "vue";
    const width = window.innerWidth -230
    const height = window.innerHeight - 111
    let scene = null
    let renderer = null
    let camera = null
    // let Controls = null
    const fov = 75
    let cube = null
    const three = ref(null)
    let isMouseDown = false
    onMounted(() => {
        initScene()
        initCamera()
        initRenderer()
        // initOrbitControls()
        three.value.addEventListener("mousedown",()=>{
            isMouseDown = true
        })
        three.value.addEventListener("mouseup",()=>{
            isMouseDown = false
        })
        three.value.addEventListener("mouseout",()=>{
            isMouseDown = false
        })
        three.value.addEventListener("mousemove",(event)=>{
            if(isMouseDown){
                camera.rotation.y += event.movementX * 0.05
                camera.rotation.x += event.movementY * 0.05

                camera.rotation.order = 'YXZ'
            }
            isMouseDown = false
        })
        //创建客厅
        let liveingRoom = new Room('客厅',4,'../images/living/')
        //创建厨房
        let kitchenPosition = new THREE.Vector3(0,0,-10)
        const kitchenRoom = new Room('厨房',2,'../images/kitchen/',kitchenPosition)

        let kitchenText = new SpriteText('厨房',new THREE.Vector3(4,0,-4))

        //厨房精灵的文字回调函数
        kitchenText.onclick(() => {
            // initOrbitControls()
            const tweenCamera = new TWEEN.Tween(camera.position)
            tweenCamera.to(new THREE.Vector3(0,0,-11),1000)
                // .easing(TWEEN.Easing.Quadratic.InOut)   //设置缓动函数
                // .onUpdate((obj) => {
                //     Controls.target.set(obj.x,obj.y,obj.z); //坐标原点
                //     camera.lookAt(obj.x,obj.y,obj.z)
                // })
                .start()
        })
        
        let livingText = new SpriteText('客厅',new THREE.Vector3(2.5,0,-6))
        livingText.onclick(() =>{
            const tweenCamera = new TWEEN.Tween(camera.position)
            tweenCamera.to(new THREE.Vector3(0,0,0),1000)
                .start()
        })
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
        camera.position.set(0,0,0.1)
        
        console.log('那时间长巴适得很VB的附件卡包',camera.position);
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
    // function initOrbitControls(){
    //     Controls = new OrbitControls(camera,renderer.domElement)
    //     // Controls.enableDamping = true
    //     Controls.update()
    // }
    //动画刷新
    let req;
    function initAnimate(){
        req = requestAnimationFrame(initAnimate)
        TWEEN.update()  //更新tween
        // Controls !== null && Controls.update()
        renderer.render(scene, camera);//渲染操作
    }
    //监听画布的全屏事件
    function onresize(){
        let that = this
        window.onresize = function(){
            renderer.setSize(window.innerWidth -230,window.innerHeight - 111);
            camera.aspect = (window.innerWidth -230) / (window.innerHeight - 111);
            camera.updateProjectionMatrix();
        }
    }
    //创建精灵文字
    class SpriteText{
        constructor(text,position){
            this.callback = []
            const canvas = document.createElement('canvas')
            canvas.width = 1024
            canvas.height = 1024
            const context = canvas.getContext('2d')
            context.fillStyle = 'rgba(100,100,100,0.5)'
            context.fillRect(0,256,1025,512)
            context.textAlign = 'center'
            context.textBaseLine = 'middle'
            context.font = 'bold 200px Arial'
            context.fillStyle = 'white'
            context.fillText(text,512,512)
            let texture = new THREE.CanvasTexture(canvas)
            const material = new THREE.SpriteMaterial({
                map:texture,
                transparent:true
            })
            const sprite = new THREE.Sprite(material)
            sprite.position.copy(position)
            this.sprite = sprite
            scene.add(sprite)

            let mouse = new THREE.Vector2()
            let raycaster = new THREE.Raycaster()
            window.addEventListener('click',(event) =>{
                mouse.x = event.clientX / window.innerWidth * 2 - 1
                mouse.y = event.clientY / window.innerHeight * 2 - 1
                raycaster.setFromCamera(mouse,camera)

                let intersects = raycaster.intersectObject(sprite)
                if(intersects.length > 0){
                    this.callback.forEach(callback => {
                        callback()
                    })
                }
            })
        }
        onclick(callback){
            this.callback.push(callback)
        }
    }
    //创建一个房间
    class Room{
        constructor(name,roomIndex,textureUrl,
            position = new THREE.Vector3(0,0,0),
            //旋转角度
            euler = new THREE.Euler(0,0,0)){
                this.name = name

                //添加立方体
                // function initCube(){
                    const geometry = new THREE.BoxGeometry(10,10,10)
                    var textureCubeArr = [
                        `${roomIndex}_l`,
                        `${roomIndex}_r`,
                        `${roomIndex}_u`,
                        `${roomIndex}_d`,
                        `${roomIndex}_b`,
                        `${roomIndex}_f`
                    ]
                    let boxMaterial = []
                    textureCubeArr.forEach(item => {
                        //将每一个图片贴到立方体上面
                        let textureCube = new THREE.TextureLoader().load(textureUrl + item + '.jpg')
                        if(item === `${roomIndex}_u` || item === `${roomIndex}_d`){
                            textureCube.rotation = Math.PI
                            textureCube.center = new THREE.Vector2(0.5,0.5)
                        }
                        
                        boxMaterial.push(
                                new THREE.MeshBasicMaterial({
                                    map:textureCube
                                }) 
                            )
                    })
                    cube = new THREE.Mesh(geometry,boxMaterial)
                    cube.position.copy(position)
                    cube.rotation.copy(euler)
                    cube.geometry.scale(1,1,-1)  //把z轴颠倒过来，就可以以内部视角看
                    scene.add(cube)
                // }

                //添加球
                // initSphere(){
                //     let that = this
                //     const geometry = new THREE.SphereGeometry(5,32,32)
                //     const loader = new RGBELoader()
                //     loader.load('./hdr/Living.hdr',function(texture){
                //         const material = new THREE.MeshBasicMaterial({
                //             map:texture
                //         })
                //         const sphere = new THREE.Mesh(geometry,material)
                //         sphere.geometry.scale(1,1,-1)
                //         scene.add(sphere)
                //     })
                // },
                //添加轨道控制器

        }
    }

    onUnmounted(() => {
        cancelAnimationFrame(req)
    })
</script>

<style>
.home-content{
    position: fixed;
    right: 20px;
    top: 90px;
    z-index: 10;
}
</style>