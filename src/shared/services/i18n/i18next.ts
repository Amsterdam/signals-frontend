import i18next from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    lng: 'nl',
    fallbackLng: 'nl',
    ns: ['labels'],
    defaultNS: 'labels',

    interpolation: {
      escapeValue: false,
    },
  })
