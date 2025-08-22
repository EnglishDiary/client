import { createI18n } from 'vue-i18n'
import ko from './locales/ko.json'
import en from './locales/en.json'

const messages = {
  ko,
  en
}

const savedLocale = localStorage.getItem('dbgdLocale') || 'ko'

const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
  legacy: false // Composition API 사용시
})

export default i18n