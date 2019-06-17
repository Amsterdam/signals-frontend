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
        render: PreviewComponents.ObjectValue, // use value.label as plaintext,
        optional: true
      },
      extra_straatverlichting_hoeveel: {
        label: 'Aantal lichtpunten',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_straatverlichting_probleem: {
        label: 'Probleem',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_straatverlichting_nummer: {
        label: 'Lichtpunt(en) op kaart',
        render: PreviewComponents.CommaArray,
        optional: true
      },
      extra_straatverlichting_niet_op_kaart_nummer: {
        label: 'Nummer lichtpunt(en)',
        render: PreviewComponents.CommaArray,
        optional: true
      },
    },
    email: {
      email: {
        label: 'Uw e-mailadres',
        render: PreviewComponents.PlainText
      }
    }
  }
};
