<template>
    <div class="com-container">
        <div class="title" :style="comStyle">
            <span @click="showChoice = !showChoice">{{ '▎ ' + showTitle}}</span>
            <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
            <div class="select-con" v-show="showChoice" :style="marginStyle">
                <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSleect(item.key)">
                    {{item.text}}
                </div>
            </div>
        </div>
        <div class="echart" ref="Echarts"></div>
    </div>
</template>

<script setup>
    import * as echarts from 'echarts'
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';
    import { getThemeValue } from '@/utils/theme_utils'
    import { computed, onMounted, onUnmounted, ref,watch } from 'vue';
    let Echarts = ref()
    let chartInstance;
    let allData = ref()
    let showChoice = ref(false)  //是否显示可选项
    let choiceType = ref('map') //显示的数据类型
    let titleFontSize = ref(0) //指明标题字体大小
    let store = useStore()
    const initOption = {
        xAxis:{
            type:'category',
            boundaryGap:false  //紧挨边缘设置
        },
        yAxis:{
            type:'value'
        },
        
        textStyle:{
                color:'#fff'
            },
        grid:{
            top:'35%',
            left:'3%',
            right:'4%',
            bottom:'1%',
            containLabel:true
        },
        tooltip:{   //鼠标移入图表时触发提示
            trigger:'axis',
            backgroundColor:'rgba(0,0,0,0.1)',
            axisPointer:{
                type:'cross',
            },
            textStyle:{
                color:'#fff'
            }
        },
        legend:{   //图例的样式设置
            left:20,
            top:'15%',
            icon:'circle'  
        }

    }

    onMounted(() => {
        initChart()
        getDatas()
        window.addEventListener('resize',screenAdapter)
        screenAdapter()
    }),
    onUnmounted(() => {
        window.removeEventListener('resize',screenAdapter)
    })
    function initChart(){
        chartInstance = echarts.init(Echarts.value,theme.value)
        
        chartInstance.setOption(initOption)
    }
    //ret 就是服务端发送给客户端的图表的数据
    async function getDatas(){
        const {data:ret} = await getData('trend')
        allData.value = ret
        updateChart()
    }
    
    //半透明的颜色值
    const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)',
    ]
    //全透明的颜色值
    const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)',
    ]
    function updateChart(){
        const timeArr = allData.value.common.month  //类目轴的数据
        const valueArr = allData.value[choiceType.value].data
        const seriesArr = valueArr.map((item,index) => {
            return {
                type:'line',
                smooth: true,  //true是平滑曲线，false是折线
                showSymbol: false,  //是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示 
                data:item.data,
                stack:choiceType.value,
                name:item.name,
                areaStyle:{
                    color:new echarts.graphic.LinearGradient(0,0,0,1,[
                        {
                            color:colorArr1[index],offset:0
                        },
                        {
                            color:colorArr2[index],offset:1
                        }
                    ])
                }
            }
        })
        //图例的数据
        const legendArr = valueArr.map((item) => {
            return item.name
        })
        const dataOption = {
            xAxis:{
                data:timeArr
            },
            legend:{
                data:legendArr
            },
            series:seriesArr
        }
        chartInstance.setOption(dataOption)
    }
    function screenAdapter(){
        titleFontSize.value = Echarts.value.offsetWidth / 100 * 3.6
        const adapterOption = {
            legend:{
                itemWidth:titleFontSize.value,
                itemHeight:titleFontSize.value,
                itemGap:titleFontSize.value,
                textStyle:{
                    fontSize:titleFontSize.value / 2,
                    color:theme.value
                }
            }
        }
        chartInstance.setOption(adapterOption)
        chartInstance.resize()
        return 'trend'
    }
    function handleSleect(event){
        choiceType.value = event
        updateChart()
        showChoice.value = false
    }
    const selectTypes = computed(() => {
        if(!allData.value){
            return []
        }else{
            return allData.value.type.filter(item => {
                return item.key != choiceType.value
            })
        }
    })
    const showTitle = computed(() =>{
        if(!allData.value){
            return ''
        }else{
            return allData.value[choiceType.value].title
        }
    })
    //设置给标题的样式
    const comStyle = computed(() => {
        return {
            fontSize:titleFontSize.value + 'px',
            color:getThemeValue(theme.value).titleColor
        }
    })
    const marginStyle = computed(() => {
        return {
            marginLeft:titleFontSize.value + 'px'
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
    .title{
        position: absolute;
        left:20px;
        top:10px;
        z-index: 10;
        color: #201616 ;
    }
    .title .title-icon{
            margin-left: 10px;
            cursor: pointer;
            color: #201616 ;
        }
    .select-con{
        text-align: left;
        background-color: #282b3604 ;
    }
    .echart{
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>