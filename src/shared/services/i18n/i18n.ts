import i18next from 'i18next'
import ChainedBackend from 'i18next-chained-backend'
import Backend from 'i18next-http-backend'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

import configuration from 'shared/services/configuration/configuration'

i18next
  .use(initReactI18next)
  .use(ChainedBackend)
  .init({
    lng: 'nl',
    fallbackLng: 'nl',
    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
      escapeValue: false,
    },

    backend: {
      backends: [
        // if a namespace can't be loaded via normal http-backend loadPath, then the inMemoryLocalBackend will try to return the correct resources
        Backend,
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`./fallback/locales/${language}/${namespace}.json`)
        ),
      ],
      backendOptions: [
        {
          loadPath: `${configuration.apiBaseUrl}/signals/v1/public/translations.json`,
        },
      ],
    },
  })
