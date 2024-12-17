import { createApp, watch } from 'vue'
import MessageBoxComponent from './MessageBox.vue'

const fields = ['confirm', 'prompt']
const MessageBox = (options) => {
  const messageBoxApp = createApp(MessageBoxComponent, options)

  return new Promise((resolve, reject) => {
    showMessageBox(messageBoxApp, { resolve, reject })
  })
}

fields.forEach((field) => {
  MessageBox[field] = (options) => {
    options.field = field
    return MessageBox(options)
  }
})

const showMessageBox = (app, { resolve, reject }) => {
  const oFrag = document.createDocumentFragment()
  const vm = app.mount(oFrag)
  document.body.appendChild(oFrag)
  vm.setVisible(true)

  watch(vm.state, (state) => {
    if (!state.visible) {
      switch (state.type) {
        case 'cancel':
          reject()
          break
        case 'confirm':
          resolve(state.promptValue)
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
export { fields }
export default MessageBox
