import configuration from 'shared/services/configuration/configuration'

export interface SuccessSections {
  ja: {
    title: string
    body: string
  }
  nee: {
    title: string
    body: string
  }
}

export interface RenderSections {
  TOO_LATE: {
    title: string
    body: string
  }
  FILLED_OUT: {
    title: string
    body: string
  }
  NOT_FOUND: {
    title: string
    body?: string
  }
}

export const renderSections: RenderSections = {
  TOO_LATE: {
    title: 'Helaas, u kunt niet meer reageren op deze melding',
    body: 'Na ons antwoord hebt u 2 weken de tijd om een reactie te geven.',
  },
  FILLED_OUT: {
    title: 'U hebt al een reactie gegeven op deze melding',
    body: 'Door uw reactie weten we wat we goed doen en wat we kunnen verbeteren.',
  },
  NOT_FOUND: {
    title: 'Het feedback formulier voor deze melding kon niet gevonden worden',
  },
}

export const successSections: SuccessSections = configuration.featureFlags
  .reporterMailHandledNegativeContactEnabled
  ? {
      ja: {
        title: 'Bedankt voor uw reactie',
        body: 'Door uw reactie weten we wat we goed doen en wat we kunnen verbeteren.',
      },
      nee: {
        title: 'Bedankt voor uw reactie',
        body: `Door uw reactie weten we wat we kunnen verbeteren.`,
      },
    }
  : {
      ja: {
        title: 'Bedankt voor uw feedback!',
        body: 'We zijn voortdurend bezig onze dienstverlening te verbeteren.',
      },
      nee: {
        title: 'Bedankt voor uw feedback!',
        body: `We zijn voortdurend bezig onze dienstverlening te verbeteren.`,
      },
    }

export const contactAllowedText =
  '\n U ontvangt direct een e-mail met een overzicht van uw reactie. Binnen 3 werkdagen leest u wat wij ermee gaan doen.'
