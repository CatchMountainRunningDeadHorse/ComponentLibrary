<template>
    <div class="com-container">
        <div class="echart" ref="Echarts"></div>
        <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{catName}}</span>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { getThemeValue } from '@/utils/theme_utils'
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';
    import { computed, onMounted, onUnmounted, ref,watch } from 'vue';
    let Echarts = ref()
    let chartInstance;
    let allData = ref()
    let titleFontSize = ref(0)  //是否显示可选项
    let currentIndex = ref(0) //指明标题字体大小
    let store = useStore()

    const initOption = {
        title:{
            text:'▎ 热销商品',
            left:20,
            top:10
        },
        series:[
            {
                type:'pie',
                label:{
                    show:false
                },
                emphasis:{
                    label:{
                        show:true
                    },
                    labelLine:{
                        show:false
                    }
                }
            }
        ],
        legend:{
            top:'15%',
            icon:'circle'
        },
        tooltip:{
            show:true,
            backgroundColor:'rgba(34,39,51,0.8)',
            textStyle:{
                color:'#fff'
            },
            borderColor:'TransformStream',
            formatter:(arg) => {
                const thirdCategoy = arg.data.children
                let total = 0
                thirdCategoy.forEach(item => {
                    total += item.value
                });
                let retStr = ''
                thirdCategoy.forEach(item => {
                    retStr += `
                        ${item.name}:${parseInt(item.value / total * 100) + '%'}
                        <br>
                    `
                })
                return retStr
            }
        }
    }

    
    onMounted(() => {
        initChart()
        getDatas()
        window.addEventListener('resize',screenAdapter)
        screenAdapter()
    })

    onUnmounted(() => {
        window.removeEventListener('resize',screenAdapter)
    })
    function initChart(){
        chartInstance = echarts.init(Echarts.value,theme.value)

        chartInstance.setOption(initOption)
    }
    async function getDatas(){
        const {data:ret} = await getData('hotproduct')
        allData.value = ret
        updateChart()
    }
    function updateChart(){
        //处理数据
        const legendData = allData.value[currentIndex.value].children.map(item => {
            return item.name
        })
        const seriesData = allData.value[currentIndex.value].children.map(item => {
            return {
                name:item.name,
                value:item.value,
                children:item.children
            }
        })
        const dataOption = {
            legend:{
                data:legendData
            },
            series:[
                {
                    data:seriesData
                }
            ]
        }
        chartInstance.setOption(dataOption)
    }
    function screenAdapter(){
        titleFontSize.value = Echarts.value.offsetWidth / 100 * 3.6
        const adapterOption = {
            title:{
                textStyle:{
                    fontSize:titleFontSize.value,
                    color:'#fff'
                }
            },
            series:[
                {
                    radius:titleFontSize.value * 4.5,
                    center:['50%','60%']
                }
            ],
            legend:{
                itemWidth:titleFontSize.value,
                itemHeight:titleFontSize.value,
                itemGap:titleFontSize.value,
                textStyle:{
                    fontSize:titleFontSize.value,
                    color:theme.value
                }
            }
        }
        chartInstance.setOption(adapterOption)
        chartInstance.resize()
        return 'hot'
    }
    function toLeft(){
        currentIndex.value--
        if(currentIndex.value < 0){
            currentIndex.value = allData.value.length - 1
        }
        updateChart()
    }
    function toRight(){
        currentIndex.value++
        if(currentIndex.value > allData.value.length - 1){
            currentIndex.value = 0
        }
        updateChart()
    }
    let catName = computed(() => {
        if(!allData.value){
            return ''
        }else{
            return allData.value[currentIndex.value].name
        }
    })
    let comStyle = computed(() => {
        return{
            fontSize:titleFontSize.value + 'px',
            color:getThemeValue(theme.value).titleColor
        }
    })
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
    .arr-left{
        position: absolute;
        left:10%;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #fff ;
    }
    .arr-right{
        position: absolute;
        right:10%;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #fff ;
    }
    .cat-name{
        position: absolute;
        left: 80%;
        bottom: 20px;
        color: #fff;
    }
    .echart{
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>