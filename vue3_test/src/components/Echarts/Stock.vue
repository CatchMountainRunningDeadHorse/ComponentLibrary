<template>
    <div class="com-container">
        <div class="echart" ref="Echarts"></div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';
    import { onMounted, onUnmounted, ref,computed,watch } from 'vue';
    let Echarts = ref()
    let chartInstance,allData,timerId;
    let currentIndex = 0 // 当前显示的页数
    let store = useStore()

    
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
    const initOption = {
        title:{
            text:'▎库存和销量分析',
            left:20,
            top:10
        },
        series:[]
    }
    function initChart(){
        chartInstance = echarts.init(Echarts.value,theme.value)
        chartInstance.setOption(initOption)
        chartInstance.on('mouseover',() => {
            clearInterval(timerId)
        })
        chartInstance.on('mouseout',() => {
            startInterval()
        })
    }
    async function getDatas(){
        const {data:ret} = await getData('stock')
        allData = ret
        updateChart()
        startInterval()
    }

    const centerArr = [
        ['18%','40%'],
        ['50%','40%'],
        ['82%','40%'],
        ['34%','75%'],
        ['66%','75%'],
    ]
    const colorArr = [
        ['#4FF778','#0BA82C'],
        ['#E5DD45','#E8B11C'],
        ['#E8821C','#E55445'],
        ['#5052EE','#AB6EE5'],
        ['#23E5E5','#2E72BF'],
    ]
    function updateChart(){
        //处理数据
        const start = currentIndex * 5
        const end = (currentIndex + 1) * 5
        const showData = allData.slice(start,end)
        const seriesArr = showData.map((item,index) => {
            return {
                type:'pie',
                center:centerArr[index],
                hoverAnimation:false,// 关闭鼠标移入到饼图时的动画效果
                labelLine:{
                    show:false
                },
                data:[
                    {
                        name:item.name + '\n\n' + item.sales,
                        value:item.sales,
                        itemStyle:{
                            color:new echarts.graphic.LinearGradient(0,1,0,0,[
                                {
                                    color:colorArr[index][0],offset:0
                                },
                                {
                                    color:colorArr[index][1],offset:1
                                }
                            ])
                        },
                        label:{
                            position:'center',
                            color:colorArr[index][0]
                        },
                    },
                    {
                        value:item.stock,
                        itemStyle:{
                            color:'#333843'
                        }
                    }
                ]
            }
        })
        const dataOption = {
            series:seriesArr
        }
        chartInstance.setOption(dataOption)
    }
    function screenAdapter(){
        const titleFontSize = Echarts.value.offsetWidth / 100 * 3.6
        const innerRadius = titleFontSize * 2.8
        const outterRadius = innerRadius * 1.125
        const adapterOption = {
            title:{
                textStyle:{
                    fontSize:titleFontSize,
                    color:'#fff'
                }
            },
            series:[
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize / 2
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize / 2
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize / 2
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize / 2
                    }
                },
                {
                    type:'pie',
                    radius:[outterRadius,innerRadius],
                    label:{
                        fontSize:titleFontSize / 2
                    }
                }
            ]
        }
        chartInstance.setOption(adapterOption)
        chartInstance.resize()
        return 'stock'
    }
    function startInterval(){
        if(timerId){
            clearInterval(timerId)
        }
        timerId = setInterval(() => {
            currentIndex++
            if(currentIndex > (allData.length % 5 === 0 ? allData.length / 5 - 1 : allData.length / 5)){
                currentIndex = 0
            }
            updateChart()
        }, 5000);
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

<style>
    .echart{
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>