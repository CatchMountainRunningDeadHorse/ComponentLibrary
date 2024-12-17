<template>
    <div class="com-container" @click="revertMap">
        <div class="echart" ref="Echarts"></div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import axios from 'axios'
    import { getData } from '@/http/api'
    import { getProvinceMapInfo } from '@/utils/map_utils'
    import { computed, onMounted, onUnmounted, ref,watch } from 'vue';
    import { useStore } from 'vuex';
    let chartInstance,allData;
    let mapData = ref({})
    let Echarts = ref()
    let store = useStore()

    onMounted(() => {
        initChart()
        getDatas()
        window.addEventListener('resize',screenAdapter)
        screenAdapter()
    })
    
    onUnmounted(() => {
        window.removeEventListener('resize',screenAdapter)
    })
    const initOption = {
        title:{
            text:'▎商家分布',
            left:20,
            top:10
        },
        geo:{
            type:'map',
            map:'china',
            top:'5%',
            bottom:'5%',
            itemStyle:{
                areaColor:'#2E72BF',
                borderColor:'#333'
            }
        },
        legend:{
            left:'5%',
            bottom:'5%',
            orient:'vertical'
        }
    }
    async function initChart(){
        chartInstance = echarts.init(Echarts.value,theme.value)
        //获取中国地图的矢量数据
        //http://127.0.0.1:8887/static/map/china.json
        //由于我们现在获取的地图矢量数据并不是位于后台，所有不能使用$http
        const ret = await axios.get('http://localhost:8887/static/map/china.json')
        echarts.registerMap('china',ret.data)
        
        chartInstance.setOption(initOption)
        chartInstance.on('click', async arg => {
            //arg.name 得到所点击的省份 这个省份是中文
            const provinceInfo = getProvinceMapInfo(arg.name)
            //点击的地域位置没有数据时
            if(typeof provinceInfo.key === 'undefined'){
                return
            }
            //需要获取这个省份的地图矢量数据
            //判断当前所点击的这个省份的地图矢量数据在mapData中是否存在
            if(!mapData[provinceInfo.key]){
                const ret = await axios.get('http://localhost:8887' + provinceInfo.path)
                mapData[provinceInfo.key] = ret.data
                echarts.registerMap(provinceInfo.key,ret.data)
            }
            const changeOption = {
                geo:{
                    map:provinceInfo.key
                }
            }
            chartInstance.setOption(changeOption)
        })
    }
    async function getDatas(){
        const {data:ret} = await getData('map')
        allData = ret
        updateChart()
    }
    function updateChart(){
        //处理图表需要的数据
        const legendArr = allData.map(item => {
            return item.name
        })
        const seriesArr = allData.map(item => {
            //return的对象就代表的是一个类别下的所有散点数据
            //如果想在地图中显示散点的数据，所有我们需要给散点的图表增加一个配置，coordinateSystem:geo
            return {
                type:'effectScatter',
                name:item.name,
                data:item.children,
                coordinateSystem:'geo',
                rippleEffect:{
                    scale:5,
                    brushType:'stroke'
                }
            }
        })
        const dataOption = {
            series:seriesArr,
            legend:{
                data:legendArr
            }
        }
        chartInstance.setOption(dataOption)
    }
    function screenAdapter(){
        const titleFontSize = Echarts.value.offsetWidth / 100 * 3.6
        const adapterOption = {
            title:{
                textStyle:{
                    fontSize:titleFontSize,
                    color:'#fff'
                }
            },
            legend:{
                itemWidth:titleFontSize / 2,
                itemHeight:titleFontSize / 2,
                itemGap:titleFontSize,
                textStyle:{
                    fontSize:titleFontSize / 2,
                    color:'#fff'
                }
            }
        }
        chartInstance.setOption(adapterOption)
        chartInstance.resize()
        return 'map'
    }
    //回到中国地图
    function revertMap(){
        const revertOption = {
            geo:{
                map:'china'
            }
        }
        chartInstance.setOption(revertOption)
    }

    const theme = computed(() => {
        return store.state.theme
    })

    watch(theme,(newValue) =>{
        chartInstance.dispose() // 销毁当前的图表
        initChart()  //重新以最新的主题名称初始化图表对象
        screenAdapter()
        updateChart()
    })

    defineExpose ({
        screenAdapter
    })

</script>
<style lang="css" scoped>
.echart{
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>