<template>
    <div class="aminui-wrapper">
      <div class="aminui-side-split">11</div>
      <div class="aminui-side">
        <div class="adminui-side-top">
          <h2>首页</h2>
        </div>
      </div>
      <div class="aminui-body">333</div>
    </div>
</template>

<style>
*{margin:0;padding:0;}
.aminui-wrapper{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
}
.aminui-side-split{
  width: 65px;
  flex-shrink: 0;
  background: #222b45;
  display: flex;
  flex-flow: column;
}
.aminui-side{
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  width: 210px;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
}
.aminui-body {
    flex: 1;
    display: flex;
    flex-flow: column;
}
.adminui-side-top{
  border-bottom: 1px solid #ebeef5;
  height: 50px;
  line-height: 50px;
  user-select: none;
  -webkit-app-region: drag;
  
}
.adminui-side-top h2{
  padding: 0 20px;
  font-size: 17px;
  color: #3c4a54;
}
</style>