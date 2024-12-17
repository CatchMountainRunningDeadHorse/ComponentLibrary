<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
        <span class="datetime">{{ nowDate }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('seller')"  :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('map')"  :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('rank')"  :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('hot')"  :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('stock')"  :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
    import Seller from "@/components/ShopMall/components/ThreeDEight.vue";
    import Map from "@/components/Echarts/Map.vue";
    import Hot from "@/components/Echarts/Hot.vue";
    import Rank from "@/components/Echarts/Rank.vue";
    import Stock from "@/components/Echarts/Stock.vue";
    import Trend from "@/components/Echarts/Trend.vue";
    import { getThemeValue } from '@/utils/theme_utils'
    import {formatTime} from '@/utils/util'
    import { getData } from '@/http/api'
    import { useStore } from 'vuex';
    import { computed,onMounted,ref,nextTick,getCurrentInstance, onUnmounted } from "vue";

    // 定义每一个图表的全屏状态
    const fullScreenStatus = ref({
      trend: false,
      seller: false,
      map: false,
      rank: false,
      hot: false,
      stock: false
    })
    const nowDate = ref()
    const store = useStore()
    const { proxy } = getCurrentInstance()

    onMounted(() => {
      renderer()
    })
    async function changeSize (chartName) {
      fullScreenStatus.value[chartName] = !fullScreenStatus.value[chartName]
      await nextTick(() => {
        proxy.$refs[chartName].screenAdapter()
      })
    }
    function handleChangeTheme () {
      // 修改VueX中数据
      store.commit('changeTheme')
    }

    let req;
    function renderer(){
      //获取当前时间
      var time = new Date()
      nowDate.value = formatTime(time)
      req = requestAnimationFrame(renderer)
    }

    const logoSrc = computed (() => {
      return '/static/img/' + getThemeValue(store.state.theme).logoSrc
    })
    const headerSrc = computed (() => {
      return '/static/img/' + getThemeValue(store.state.theme).headerBorderSrc
    })
    const themeSrc = computed (() => {
      return '/static/img/' + getThemeValue(store.state.theme).themeSrc
    })
    const containerStyle = computed (() => {
      return {
        backgroundColor: getThemeValue(store.state.theme).backgroundColor,
        color: getThemeValue(store.state.theme).titleColor
      }
    })

    onUnmounted(() => {
      cancelAnimationFrame(req)
    })
</script>
<style lang="css" scoped>

.fullscreen {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522 ;
  color: #fff ;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
}

.screen-header div .img{
  width: 100%;
  height: 100%; 
  object-fit: none;
}
.screen-header .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

.screen-header .title-right {
  display: flex;
  align-items: center;
  position:absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-80%);
}
.screen-header .datetime {
  font-size: 15px;
  margin-left: 10px;
}
.screen-header .logo {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-80%);
}
.screen-header .logo img {
    height: 35px;
    width: 128px;
  }
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
}

.screen-body .screen-left{
  height: 100%;
  width: 27.6%;
}

.screen-body .screen-left #left-top {
  height: 53%;
  position: relative;
}
.screen-body .screen-left #left-bottom {
  height: 31%;
  margin-top: 25px;
  position: relative;
}
.screen-body .screen-middle{
  height: 100%;
  width: 41.5%;
  margin-left: 1.6%;
  margin-right: 1.6%;
}
.screen-body .screen-middle #middle-top {
  width: 100%;
  height: 56%;
  position: relative;
}
.screen-body .screen-middle #middle-bottom {
  margin-top: 25px;
  width: 100%;
  height: 28%;
  position: relative;
}
.screen-body .screen-right{
  height: 100%;
  width: 27.6%;
}
.screen-body .screen-right #right-top {
  height: 46%;
  position: relative;
}
.screen-body .screen-right #right-bottom {
  height: 38%;
  margin-top: 25px;
  position: relative;
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
