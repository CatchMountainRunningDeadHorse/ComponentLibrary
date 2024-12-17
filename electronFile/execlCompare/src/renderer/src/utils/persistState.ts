// utils/persistState.js
import { watch } from 'vue';

export function persistState(key, state) {
  const storedState = JSON.parse(localStorage.getItem(key));

  if (storedState) {
    Object.assign(state, storedState); // 用持久化的数据初始化状态
  }

  watch(
    state,
    (newState) => {
      localStorage.setItem(key, JSON.stringify(newState));
    },
    { deep: true }
  );
}
