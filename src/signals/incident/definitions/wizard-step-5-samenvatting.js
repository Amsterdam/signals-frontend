import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components/';

export default {
  label: 'Controleer uw gegevens',
  subheader: 'Maak een aanpassing als dat nodig is.',
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
        render: PreviewComponents.ObjectValue,
        authenticated: true
      },
      priority: {
        label: 'Urgentie',
        render: PreviewComponents.ObjectValue,
        authenticated: true
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
      images_previews: {
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
    extra_straatverlichting: { // group name
      extra_straatverlichting: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: PreviewComponents.ObjectValue // use value.label as plaintext
      },
      extra_straatverlichting_hoeveel: {
        label: 'Aantal lichtpunten',
        render: PreviewComponents.ObjectValue
      },
      extra_straatverlichting_probleem: {
        label: 'Probleem',
        render: PreviewComponents.ObjectValue
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
