import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import en from './en.json'
import jp from './jp.json'
import vi from './vi.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      jp: { translation: jp }
    },
    lng: 'jp',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  }).then(() => {
    console.log('Translate Successfully.')
  })
  .catch((error) => {
    throw new Error(error)
  })

export default i18n
