import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export default function useWindowDrag(): {
  isKeyDown: Ref<boolean>;
  handleMouseDown: (event: MouseEvent) => void;
} {
  const isKeyDown = ref(false);
  const initialX = ref(0);
  const initialY = ref(0);

  const handleMouseDown = (event: MouseEvent): void => {
    isKeyDown.value = true;
    initialX.value = event.x;
    initialY.value = event.y;

    const onMouseMove = (ev: MouseEvent): void => {
      if (isKeyDown.value) {
        const x = ev.screenX - initialX.value;
        const y = ev.screenY - initialY.value;
        const data = {
          appX: x,
          appY: y,
        };
        window.electron.ipcRenderer.invoke('custom-adsorption', data);
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    const onMouseUp = (): void => {
      isKeyDown.value = false;
      document.removeEventListener('mousemove', onMouseMove as EventListener);
    };

    document.addEventListener('mouseup', onMouseUp);

    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', onMouseMove as EventListener);
      document.removeEventListener('mouseup', onMouseUp as EventListener);
    });
  };

  return {
    isKeyDown,
    handleMouseDown,
  };
}