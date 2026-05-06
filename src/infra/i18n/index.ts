import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'vi',
    fallbackLng: 'vi',
    supportedLngs: ['vi'],
    interpolation: { escapeValue: false },
    ns: ['translation'],
    defaultNS: 'translation'
  })

export default i18n
