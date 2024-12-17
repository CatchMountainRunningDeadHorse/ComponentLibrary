<template>
  <div class="itemChart">
    <div style="color: #fff; padding: 0px 0 0 20px">机台运转情况统计</div>
  </div>
</template>

<script setup></script>

<style scoped>
.itemChart {
  min-width: 400px;
  height: 100%;
  z-index: 22;
  position: relative;
  box-sizing: border-box;
}
.itemChart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-image: url('/static/img/icon_2.png');
  background-size: 100% 100%;
  /* opacity: 0.6; */
}
</style>
