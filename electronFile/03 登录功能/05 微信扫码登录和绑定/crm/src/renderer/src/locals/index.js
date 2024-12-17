import { createI18n } from 'vue-i18n'

import el_zh_cn from 'element-plus/lib/locale/lang/zh-cn'
import el_en from 'element-plus/lib/locale/lang/en'

import zh from './lang/zh-cn'
import en from './lang/en'

const messages = {
  'zh-cn':{
    el:el_zh_cn,
    ...zh
  },
  'en':{
    el:el_en,
    ...en
  }
}

const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh-cn',
  fallbackLocale: 'en',
  messages, 
})

export default i18n