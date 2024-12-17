import { createApp, watch } from 'vue'
import MessageBoxComponent from './MessageBox.vue'

const MessageBox = (options) => {
  const MessageBoxApp = createApp(MessageBoxComponent, options)

  return showMessageBox(MessageBoxApp, options)
}

const showMessageBox = (app, { confirm, cancel }) => {
  const oFrag = document.createDocumentFragment()
  const vm = app.mount(oFrag)
  document.body.appendChild(oFrag)

  vm.setVisible(true)

  watch(vm.state, (state) => {
    if (!state.visible) {
      switch (state.type) {
        case 'cancel':
          typeof cancel === 'function' && cancel()
          break
        case 'confirm':
          typeof confirm === 'function' && confirm()
          break
        default:
          break
      }
      hideMessageBox(app)
    }
  })
}

const hideMessageBox = (app) => {
  app.unmount(app)
}
export default MessageBox
