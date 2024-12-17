<template>
    <div class="com-container">
        <div class="echart" ref="Echarts"></div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { onMounted,ref,onUnmounted,computed,watch } from 'vue';
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';

    const Echarts = ref(null)
    let chartInstance,allData,timeID;
    let currentPage = 1
    const store = useStore()
    const initOption = {
            title:{
                text:'▎商家销售统计',
                left:20,
                top:10
            },
            grid:{
                top:'20%',
                left:'3%',
                right:'6%',
                bottom:'3%',
                containLabel:true
            },
            xAxis:{
                type:'value'
            },
            textStyle:{
                color:'#fff'
            },
            yAxis:{
                type:'category',
            },
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'line',
                    z:0,
                    lineStyle:{
                        color:'#2D3443',
                        type:'solid'
                    },
                }
            },
            series:[
                {
                    type:'bar',
                    label:{
                        show:true,
                        position:'right',
                        textStyle:{
                            color:'#FFFFFF'
                        }
                    },
                    itemStyle:{
                        // color:{
                        //     type:'linear', //线性渐变
                        //     x:0,
                        //     y:0,
                        //     x2:1,
                        //     y2:0,
                        //     colorStops:[
                        //         {
                        //             offset:0,color:'#5052EE'
                        //         },
                        //         {
                        //             offset:1,color:'#AB6EE5'
                        //         },
                        //     ]
                        // },
                        color: new echarts.graphic.LinearGradient(0,0,1,0,[
                            {
                                offset:0,color:'#5052EE'
                            },
                            {
                                offset:1,color:'#AB6EE5'
                            }
                        ])
                    }
                }
            ]
        }

    onMounted(() => {
        initChart()
        getDatas()
        window.addEventListener('resize', screenAdapter)
        //在页面加载完成的时候 主动进行屏幕的适配
        screenAdapter()
    })

    onUnmounted(() => {
        clearInterval(timeID)
    })

    function initChart(){
        chartInstance = echarts.init(Echarts.value,theme.value)

        chartInstance.setOption(initOption)
        chartInstance.on('mouseover',() => {
            clearInterval(timeID)
        })
        chartInstance.on('mouseout',() => {
            startInterval()
        })
    }
    let totalPage = 0
    async function getDatas(){
        const {data:ret} = await getData('seller')
        allData = ret
        allData.sort((a,b) => {
            return a.value - b.value  //从小到大的排序
        })
        //每5个元素显示一页
        totalPage = allData.length % 5 === 0 ? allData.length / 5 : Math.ceil(allData.length /5)
        updateChart()
        // startInterval()  //启动定时器
    }
    function updateChart(){
        const start = (currentPage - 1) * 5
        const end = currentPage * 5
        const showData = allData.slice(start,end)
        const sellerNames = showData.map((item) => {
            return item.name
        })
        const sellerValues = showData.map((item) => {
            return item.value
        })
        const dataOption = {
            yAxis:{
                data:sellerNames
            },
            series:[
                {
                    data:sellerValues,
                }
            ]
        }
        chartInstance.setOption(dataOption)
    }
    function startInterval(){
        if(timeID){
            clearInterval(timeID)
        }
        timeID = setInterval(() => {
            currentPage++
            if(currentPage > totalPage){
                currentPage = 1
            }
            updateChart()
        },2500)
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
            tooltip:{
                axisPointer:{
                    lineStyle:{
                        width:titleFontSize,
                    },
                }
            },
            series:[
                {
                    barWidth:titleFontSize,
                    itemStyle:{
                        borderRadius:[0,titleFontSize / 2, titleFontSize / 2,0],
                    }
                }
            ]
        }
        chartInstance.setOption(adapterOption)
        //手动的调用图标对象的resize 才能产生效果
        chartInstance.resize()

        return 'seller'
    }
    const theme = computed(() => {
        return store.state.theme
    })

    watch(theme,(newValue) =>{
        console.log('seller主题切换了');
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