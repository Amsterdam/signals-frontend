import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components/';

export default {
  label: 'Controleer uw gegevens',
  subtitle: 'Maak een aanpassing als dat nodig is.',
  nextButtonLabel: 'Verstuur',
  nextButtonClass: 'action primary',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'CREATE_INCIDENT',
  form: {
    controls: {
      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  },
  preview: {
    beschrijf: {
      source: {
        label: 'Bron',
        render: PreviewComponents.PlainText,
        authenticated: true
      },
      priority: {
        label: 'Urgentie',
        render: PreviewComponents.KeyValue,
        authenticated: true,
        values: {
          normal: 'Normaal',
          high: 'Hoog'
        }
      },
      location: {
        label: 'Hier is het',
        render: PreviewComponents.Map
      },
      description: {
        label: 'Hier gaat het om',
        render: PreviewComponents.PlainText
      },
      datetime: {
        label: 'Tijdstip',
        render: PreviewComponents.DateTime
      },
      image: {
        label: 'Foto',
        render: PreviewComponents.Image,
        optional: true
      }
    },
    telefoon: {
      phone: {
        label: 'Uw (mobiele) telefoon',
        render: PreviewComponents.PlainText
      }
    },
    email: {
      email: {
        label: 'Uw e-mailadres',
        render: PreviewComponents.PlainText
      }
    }
  }
};
