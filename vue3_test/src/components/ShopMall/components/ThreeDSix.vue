<template>
    <div class="container">
        <div ref="three"></div>
        <div ref="provinceInfo" class="provinceInfo"></div>
    </div>
</template>

<script setup>
    import * as THREE from "three";
    import Base from '../../../utils/Base'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    // import TWEEN from 'three/examples/jsm/libs/tween.module.js'
    import * as d3 from "d3"
    import {flylineAddress,airplaneAddress,centerAddress} from '../../../utils/constant'
    import { onMounted,onUnmounted,ref } from "vue";
    let base,Controls,raycaster,INTERSECTED,req;
    const mouse = new THREE.Vector2();
    let three = ref()
    let provinceInfo = ref()
    onMounted(async() => {
        base = new Base(three.value)
        base.camera.position.z = 60
        base.camera.updateProjectionMatrix()
        base.addAmbientLight(0.55)
        Controls = new OrbitControls(base.camera,base.renderer.domElement)
        raycaster = new THREE.Raycaster();
        await loadMap()
        update()
        window.addEventListener('resize',resize)
		window.addEventListener( 'mousemove', onDocumentMouseMove );
    })

    onUnmounted(() => {
        window.removeEventListener('mousemove',onDocumentMouseMove)
        cancelAnimationFrame(req)
    })

    async function loadMap(){
        const fileloader = new THREE.FileLoader()
        let res = await Promise.all([
            fileloader.loadAsync("/json/china.json"),
            fileloader.loadAsync("/json/chinadeg.json")
        ])
        if(Array.isArray(res)){
            //创建地图
            createMap(res[0])
        }
    }

    const projection = d3
        .geoMercator()  //地图投影方式（用于绘制球形墨卡托投影）
        .center([108.5525,34.3227])  //地图中心点经纬度坐标
        .scale(84)  //缩放
        .translate([0,0])  //移动地图位置
    let chinaObj = new THREE.Object3D()
    let curveArr = []

    function createMap(res){
        res = JSON.parse(res)
        let centerCoord = null
        res.features.forEach((province) => {
            let provinceObj = new THREE.Object3D()
            if(province.geometry.type === 'MultiPolygon'){
                province.geometry.coordinates.forEach((MultiPolygon) => {
                    MultiPolygon.forEach((Polygon) => {
                        let shape = new THREE.Shape()
                        let arr = []
                        Polygon.forEach((coord,index) => {
                            let [x, y] = projection(coord)
                            if(index === 0){
                                shape.moveTo(x, -y)
                            }else{
                                shape.lineTo(x, -y)
                            }
                            arr.push(x, -y, 1)
                        })
                        let mesh = createPolygon(shape,arr,province)
                        provinceObj.add(mesh)
                    })
                })
            }else if(province.geometry.type === 'Polygon'){
                province.geometry.coordinates.forEach((Polygon) => {
                    let shape = new THREE.Shape()
                    let arr = []
                    Polygon.forEach((coord,index) => {
                        let [x, y] = projection(coord)
                        if(index === 0){
                            shape.moveTo(x, -y)
                        }else{
                            shape.lineTo(x, -y) 
                        }
                        arr.push(x, -y, 1)
                    })
                    let mesh = createPolygon(shape,arr,province)
                    provinceObj.add(mesh)
                })
            }
            if(province.properties.name === centerAddress){
                centerCoord = createSprite(province,'/images/aperture.png',true)
            }
            
            chinaObj.add(provinceObj)
        })
        if(centerCoord){
            res.features.forEach((province) => {
            //飞线
            if(flylineAddress.indexOf(province.properties.name) !== -1){
                let address = createSprite(province,'/images/circle.png',false)
                addressLines(centerCoord,address)
            }
            //飞机
            if(airplaneAddress.indexOf(province.properties.name) !== -1){
                let address = createSprite(province,'/images/circle.png',false)
                createSprite(province,'/images/ring.png',true,3)
                let { curve } = addressLines(centerCoord,address)
                curveArr.push(curve)
                createSphere(centerCoord)
            }
        })
        }
        base.scene.add(chinaObj)
    }

    const extrudeMats = [
        new THREE.MeshStandardMaterial({
            color:0x02A1E2,
            transparent:true,
            opacity:0.85,
            blending:THREE.AdditiveBlending,
        }),
        new THREE.MeshStandardMaterial({
            color:0x3480C4,
            transparent:true,
            opacity:0.35,
            blending:THREE.AdditiveBlending,
        })
    ]
    const edgMat = new THREE.LineBasicMaterial({
        color:0xffffff,
        blending:THREE.AdditiveBlending
    })

    function createPolygon(shape,arr,province){
        let geo = new THREE.ExtrudeGeometry(shape)  //挤压缓冲几何体(从一个形状路径中，挤压出一个BufferGeometry)
        let mesh = new THREE.Mesh(geo,extrudeMats)
        if(province.properties.name){
            mesh.name = province.properties.name
        }

        //画线
        let buffer = new THREE.BufferGeometry()
        buffer.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(arr),3)
        )
        let line = new THREE.Line(buffer,edgMat)
        chinaObj.add(line)
        return mesh
    }

    const textureloader = new THREE.TextureLoader()
    const animCircle = []

    function createSprite(
        province,  //省份信息
        imageurl,  //图片路径
        needanim = false,  //是否需要动画
        scaleparam = 2.5,  //缩放
        opacity = 10.0,  //透明度
        speed = 0.015  //速度
    ){
        let [x, y] = projection(province.properties.center)
        const map = textureloader.load(imageurl)
        let material = new THREE.MeshBasicMaterial({
            map,
            transparent:true,
            depthWrite:false,
            depthTest:false,
            blending:THREE.AdditiveBlending
        })
        let sprite = new THREE.Sprite(material)
        if(needanim){
            animCircle.push({
                circle:sprite,
                offset:0,
                speed,
                scaleparam,
                opacity,
            })
        }
        sprite.position.set(x,-y,1)
        chinaObj.add(sprite)
        return [x,-y,1]
    }

    const PointsCount = 100
    const addressMat = new THREE.LineBasicMaterial({
        color:0xff0000
    })
    function addressLines(start,end){
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(...start),
            new THREE.Vector3(
                (start[0]+end[0]) / 2,
                (start[1]+end[1]) / 2,
                9
            ),
            new THREE.Vector3(...end)
        )
        const points = curve.getPoints(PointsCount)
        const buffer = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(buffer,addressMat)
        chinaObj.add(line)
        return {points,curve}
    }

    let planeMesh = []
    function createSphere(position){
        const geometry = new THREE.SphereGeometry(1,32,16)
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
        });
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.position.x = position[0]
        mesh.position.y = position[1]
        mesh.position.z = position[2]
        planeMesh.push(mesh)
        base.scene.add(mesh)
    }
    function planeFly(plane,curve,t){
        //设置飞机飞行路径
        plane.position.copy(curve.getPoint(t))   //getPointAt()
        //设置飞机飞行方向
        plane.lookAt(curve.getPoint(t + 0.01))
    }

    let clock = new THREE.Clock()
    function update(){
        req = requestAnimationFrame(update)
        animCircle.forEach((el,index) => {
            el.circle.material.opacity = el.opacity*Math.pow((1-el.offset),2)
            el.circle.scale.set(
                el.scaleparam * el.offset,
                el.scaleparam * el.offset,
                el.scaleparam * el.offset,
            )
            el.offset += el.speed;
            el.offset %= 1
        })
        let t = clock.getElapsedTime() % 5
        t = t / 5
        planeMesh.forEach((el,index) => {
            planeFly(el,curveArr[index],t)
        })
        base.update()
        Controls.update()
    }

    function resize(){
        base.resize()
    }

    function onDocumentMouseMove( event ) {

        event.preventDefault();

        mouse.x = ( (event.clientX - 200) / (window.innerWidth - 200) ) * 2 - 1;
        mouse.y = - ( (event.clientY - 60) / (window.innerHeight - 60 ) ) * 2 + 1;
        provinceInfo.value.style.left = event.clientX - 200 + 2 + 'px';
        provinceInfo.value.style.top = event.clientY - 60 + 2 + 'px';
        raycaster.setFromCamera( mouse, base.camera );
        const intersects = raycaster.intersectObjects( chinaObj.children,true );
        for(let item of intersects){
            if(item.object.material && item.object.material.length === 2){
                console.log('不大V吧接口VB的MV边框',item.object);
                createProvinceInfo(item.object)
                if ( INTERSECTED ) {
                    INTERSECTED.material[0].color.setHex(INTERSECTED.currentHex0);
                    INTERSECTED.material[1].color.setHex(INTERSECTED.currentHex1);
                }

                INTERSECTED = item.object;
                INTERSECTED.currentHex0 = INTERSECTED.material[0].color.getHex();
                INTERSECTED.currentHex1 = INTERSECTED.material[1].color.getHex();
                INTERSECTED.material[0].color.set(0xff0000) ;
                INTERSECTED.material[1].color.set(0xff0000) ;
                break
            }else {
                createProvinceInfo(item.object)
                if ( INTERSECTED ) {
                    INTERSECTED.material[0].color.setHex(INTERSECTED.currentHex0);
                    INTERSECTED.material[1].color.setHex(INTERSECTED.currentHex1);
                }

                INTERSECTED = null;

            }
        }

    }

    function createProvinceInfo(province){
        if (province.name) {
        
        provinceInfo.value.textContent = province.name;

        provinceInfo.value.style.visibility = 'visible';
      } else {
        provinceInfo.value.style.visibility = 'hidden';
      }
    }
 
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