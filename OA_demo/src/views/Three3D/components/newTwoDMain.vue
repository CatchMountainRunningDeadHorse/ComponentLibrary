<template>
  <div class="overview">
    <img
      src="/static/img/icon_1.png"
      alt=""
      width="100%"
      style="position: absolute; left: 0"
      height="80px"
    />
    <div class="panel" style="padding-left: 0; padding-right: 0" flex="main:justify dir:top">
      <div class="inner" style="overflow: hidden; width: 800px">
        <div class="cube">
          <div class="inner-float"></div>
          <div class="cir-box">
            <div class="cir1">
              <img src="/static/img/yuan01.png" alt="" />
            </div>
            <div class="cir2">
              <img src="/static/img/yuan02.png" alt="" />
            </div>
            <div class="cir"></div>
          </div>
        </div>
      </div>
      <!-- <twoDTransform /> -->
      <twoDMain />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import twoDMain from './twoDMain.vue'
import twoDTransform from './twoDTransform.vue'

const images = ref([
  '/static/img/data.png',
  '/static/img/data.png',
  '/static/img/data.png',
  '/static/img/data.png',
  '/static/img/data.png',
  '/static/img/data.png'
])
</script>

<style lang="scss" scoped>
$fontColor: #fff;

.overview {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-image: url('/static/img/ge.png');
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: #010e25;
  .panel {
    display: flex;
    padding: 0 20px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: absolute;

    .inner {
      position: relative;
      width: 100%;
      height: calc(100% - 200px);
      margin-top: 200px;
      .cube {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 10;

        .inner-float {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url('/static/img/cube.png');
          background-repeat: no-repeat;
          background-position: center 44%;
          -webkit-background-size: 160px 160px;
          background-size: 160px 160px;
          z-index: 20;
          animation: infinite shineCube 4s linear;
        }

        .cir-box {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cir {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          animation: shine infinite linear 6s;

          &::before {
            position: absolute;
            content: '';
            width: 700px;
            height: 700px;
            transform: rotateX(60deg);
            border: 1px dashed $fontColor;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }

          &::after {
            content: '';
            width: 550px;
            height: 550px;
            transform: rotateX(60deg);
            border: 1px solid $fontColor;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
        }

        .cir1 {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          animation: shine infinite linear 6s;
          img {
            width: 450px;
            height: auto;
            transform: rotateX(60deg);
          }

          &::before {
            content: '';
            width: 600px;
            height: 600px;
            border: 2px solid rgba(15, 100, 230, 0.5);
            position: absolute;
            transform: rotateX(60deg);
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(20, 140, 250, 0.4);
          }

          &::after {
            content: '';
            width: 500px;
            height: 500px;
            border: 2px dashed rgba(15, 100, 230, 0.8);
            position: absolute;
            transform: rotateX(60deg);
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
          }
        }
        .cir2 {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          animation: shine infinite linear 6s;
          img {
            width: 300px;
            height: auto;
            transform: rotateX(60deg);
          }
        }
      }
    }
  }
}

@keyframes shine {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

@keyframes shineCube {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
