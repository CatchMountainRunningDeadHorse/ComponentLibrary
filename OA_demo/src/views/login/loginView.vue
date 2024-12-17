<template>
  <div class="login-container">
    <div class="left-section">
      <img src="/static/img/006.png" alt="Illustration" class="illustration" />
    </div>
    <div class="right-section">
      <div style="background-color: #fff; height: 560px">
        <div
          class="flex align-items margin-right"
          style="height: 15%; justify-content: flex-end"
          v-if="isScanCode"
        >
          <img src="/static/img/008.png" style="height: 80%" @click="changeLoginWay" />
        </div>
        <div
          class="flex align-items margin-right"
          style="height: 15%; justify-content: flex-end"
          v-else
        >
          <img src="/static/img/007.png" style="height: 80%" @click="changeLoginWay" />
        </div>
        <div style="height: 85%">
          <template v-if="isScanCode">
            <scanCode></scanCode>
          </template>
          <template v-else>
            <account></account>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import account from './components/account.vue'
import scanCode from './components/scanCode.vue'
const isScanCode = ref(false)

const changeLoginWay = () => {
  isScanCode.value = !isScanCode.value
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-image: url('/static/img/005.png');
  background-size: cover;
}

.left-section {
  /* flex: 1; */
  display: flex;
  align-items: center;
  justify-content: end;
}

.illustration {
  /* width: 560px; */
  height: 560px;
}

.right-section {
  /* flex: 1; */
  display: flex;
  align-items: center;
  justify-content: start;
}
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .right-section {
    padding: 20px;
  }

  .login-box {
    width: 100%;
  }
}
</style>
