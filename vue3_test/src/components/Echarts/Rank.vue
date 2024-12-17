<template>
    <div class="com-container">
        <div class="echart" ref="Echarts"></div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';
    import { onMounted, onUnmounted, ref,watch,computed } from 'vue';
    let Echarts = ref()
    let chartInstance,allData,timerId;
    let endValue = 9  //是否显示可选项
    let startValue = 0 //指明标题字体大小
    let store = useStore()

    const initOption = {
        title:{
            text:'▎ 地区销售排行',
            left:20,
            top:10
        },
        grid:{
            top:'40%',
            left:'5%',
            right:'5%',
            bottom:'5%',
            containLabel:true
        },
        tooltip:{
            show:true,
            backgroundColor:'rgba(34,39,51,0.8)',
            textStyle:{
                color:'#fff'
            },
            borderColor:'TransformStream'
        },
        xAxis:{
            type:'category'
        },
        
        textStyle:{
                color:'#fff'
            },
        yAxis:{
            type:'value'
        },
        series:{
            type:'bar'
        }
    }

    
    onMounted(() => {
        initChart()
        getDatas()
        window.addEventListener('resize',screenAdapter)
        screenAdapter()
    })
    onUnmounted(() => {
        clearInterval(timerId)
        window.removeEventListener('resize',screenAdapter)
    })
    function initChart(){
        chartInstance = echarts.init(Echarts.value, theme.value)
    
        chartInstance.setOption(initOption)
        chartInstance.on('mouseover',() => {
            clearInterval(timerId)
        })
        chartInstance.on('mouseout',() => {
            startInterval()
        })
    }
    async function getDatas(){
        // 获取服务器的数据
        const {data:ret} = await getData('rank')
        allData = ret
        allData.sort((a,b) => {
            return b.value - a.value
        })
        updateChart()
        startInterval()
    }
    function updateChart(){
        const colorArr = [
            ['#0BA82C','#4FF778'],
            ['#2E72BF','#23E5E5'],
            ['#5052EE','#AB6EE5']
        ]
        //处理数据
        const provinceArr = allData.map(item => {
            return item.name
        })
        const valueArr = allData.map(item => {
            return item.value
        })
        const dataOption = {
            xAxis:{
                data:provinceArr
            },
            dataZoom:{  //区域缩放
                show:false,
                startValue:startValue,
                endValue:endValue,
            },
            series:[
                {
                    data:valueArr,
                    itemStyle:{
                        color:(arg) => {
                            let targetColorArr = null
                            if(arg.value > 300){
                                targetColorArr = colorArr[0]
                            }else if(arg.value > 200){
                                targetColorArr = colorArr[1]
                            }else{
                                targetColorArr = colorArr[2]
                            }
                            return new echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:1,color:targetColorArr[0]
                                },
                                {
                                    offset:0,color:targetColorArr[1]
                                }
                            ])
                        }
                    }
                }
            ]
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
                },
            },
            series:[
                {
                    barWidth:titleFontSize,
                    itemStyle:{
                        borderRadius:[titleFontSize/2,titleFontSize/2,0,0],
                    }
                }
            ]
        }
        chartInstance.setOption(adapterOption)
        chartInstance.resize()
        return 'rank'
    }
    function startInterval(){
        if(timerId){
            clearInterval(timerId)
        }
        timerId = setInterval(() => {
            startValue++,
            endValue++
            if(endValue > allData.length - 1){
                startValue = 0,
                endValue = 9
            }
            updateChart()
        }, 2000);
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