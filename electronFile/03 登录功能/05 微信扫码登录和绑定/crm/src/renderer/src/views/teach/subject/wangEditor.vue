<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    // 内容 HTML
    const valueHtml = ref('')

    const toolbarConfig = {}

    const editorConfig = { 
        placeholder: '请输入内容...',
        MENU_CONF:{
            uploadImage:{
                server: '/api/upload/uploadFileWithWangEditor', //上传
                fieldName: 'file', //form-data
                maxNumberOfFiles: 10, //最多可上传几个文件，默认为 100
                headers:{  // 自定义增加 http  header
                  Authorization:localStorage.getItem('TOKEN')
                },
                allowedFileTypes: ['image/*'], //选择文件时的类型限制
                timeout:10000
            }
        }
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  },
  watch:{
    valueHtml:{
      immediate:true,
      handler( newVal ){
        this.$emit('onChange',newVal);
      }
    }
    // valueHtml( newVal ){
    //   console.log( newVal );
    // }
  }
}
</script>    