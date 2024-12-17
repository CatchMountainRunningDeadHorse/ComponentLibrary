<template>
    <!-- <div> -->
        <div ref="three"></div>
        <div class="charts left">
            <div class="item">
                <p>实时空气质量</p>
                <div class="canvas" ref="canvas1"></div>
            </div>
            <div class="item">
                <p>空气质量</p>
                <div class="canvas" ref="canvas2"></div>
            </div>
            <div class="item">
                <p>未来7天温度</p>
                <div class="canvas" ref="canvas3"></div>
            </div>
        </div>
        <div class="charts right">
            <div class="item itemtop">
                
            </div>
            <div class="item">
                <p>今日最高温度</p>
                <div class="canvas" ref="canvas5"></div>
            </div>
            <div class="item">
                <p>人口分布</p>
                <div class="canvas" ref="canvas6"></div>
            </div>
        </div>
    <!-- </div> -->
</template>

<script setup>
    import * as THREE from "three";
    import Base from '../../../utils/Base'
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import {weather,nowAir,dayAir} from '../../../http/api'
    import _ from "lodash"
    // import echarts from "echarts"
    import { onMounted,onUnmounted,ref } from "vue";

    let base,Controls;
    let three = ref(null)
    let item1 = ref(null)
    let item2 = ref(null)
    let item3 = ref(null)
    let item4 = ref(null)
    let item5 = ref(null)
    
    onMounted(() => {
        base = new Base(three.value)
        base.camera.position.z = 60
        base.camera.updateProjectionMatrix()
        base.addAmbientLight(0.55)
        Controls = new OrbitControls(base.camera,base.renderer.domElement)
        createChartsData()
        update()
        window.addEventListener('resize',resize)
    })

    const airdata = ref([])
    //空气质量
    const xdataAir = ref([])
    const ydataAir = ref([])
    const airClass = ref([])
    //未来7天温度
    const xdataWeather = ref([])
    const ydataHot = ref([])
    const ydataCold = ref([])
    const weatherdata = ref([])
    async function createChartsData(){
        let res = await nowAir()
        let { pm2p5,no2,so2 } = res.now
        airdata.value = [
            {
                value:pm2p5,
                name:'PM2.5'
            },
            {
                value:no2,
                name:'二氧化氮'
            },
            {
                value:so2,
                name:'二氧化硫'
            }
        ]
        //空气质量
        res = await dayAir()
        console.log('将此女是不是的健康那个表的附件卡包看',res);
        xdataAir.value = _.map(res.daily,(val)=>{
            val.fxDate.slice(-5)
        })
        ydataAir.value = _.map(res.daily,"aqi")
        airClass.value = _.map(res.daily,(val) =>{
            return {
                fxDate:val.fxDate.slice(-5),
                category:val.category
            }
        })
        res = await weather()
        ydataHot.value = _.map(res.daily,'tempMax')
        ydataCold.value = _.map(res.daily,'tempMin')
        xdataWeather.value = _.map(res.daily,(val)=>{
            val.fxDate.slice(-5)
        })
        weatherdata.value = _.map(res.daily,(val) => {
            return {
                fxDate:val.fxDate.slice(-5),
                iconDay:val.iconDay
            }
        })
    }

    function createBox(){
        const geometry = new THREE.BoxGeometry(10,10,10)
        const material = new THREE.MeshBasicMaterial({
            color:0xff0000
        })
        const cube = new THREE.Mesh(geometry,material)
        base.scene.add(cube)
    }

    let req;
    function update(){
        req = requestAnimationFrame(update)
        base.update()
        Controls.update()
    }

    function resize(){
        base.resize()
    }

    onUnmounted(() => {
        cancelAnimationFrame(req)
    })
</script>

<style>
    .charts{
        height: 100%;
        width: 410px;
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
    .item{
        z-index: 22;
        width: 400px;
        height: 300px;
        position: relative;
        box-sizing: border-box;
    }
    .itemtop{
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }
    .item div{
        opacity: 1;
    }
    .item p{
        color: #ffffff;
        opacity: 1;
        height: 21.62px;
        width: 125px;
        line-height: 21.62px;
        font-size: 14px;
        text-align: center;
        background-image: url('/images/tilbg.png');
        background-size: 125px 21.62px;
        margin: 10px 13px;
    }
    .canvas{
        height: 163px;
    }
    .item::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 400px;
        height: 300px;
        z-index: -1;
        background-image: url('/images/bg.png');
        background-size: 400px 300px;
        opacity: 0.47;
    }
    .itemtop::before{
        background-image: none;
        background-color: #001452;
        box-shadow: inset 0 0 3px 3px #245cc1;
        opacity: 0.47;
    }
    .left{
        left: 0;
    }
    .right{
        right: 0;
    }
</style>