import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components/';
import { createCompoundPreview } from '../components/IncidentPreview/components/CompoundPreview';
import { OVL_KLOKKEN_LAYER, OVL_VERLICHTING_LAYER } from '../../../shared/services/configuration/configuration';

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
    vulaan: { // page route --> /incident/vulaan
      extra_klok: { // actual incident field name
        label: 'Is de situatie gevaarlijk?',
        render: PreviewComponents.ObjectValue, // use value.label as plaintext,
        optional: true
      },
      extra_klok_hoeveel: {
        label: 'Aantal lichtpunten',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_klok_probleem: {
        label: 'Probleem',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_klok_nummer: {
        label: 'Klok(ken) op kaart',
        render: createCompoundPreview([
          (props) => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_KLOKKEN_LAYER }),
          ({ label, ...props }) => PreviewComponents.CommaArray(props), // remove label from props
        ]),
        optional: true
      },
      extra_klok_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_klok_niet_op_kaart_nummer: {
        label: 'Klok(ken) niet op kaart',
        render: PreviewComponents.CommaArray,
        optional: true
      },

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
        render: createCompoundPreview([
          (props) => PreviewComponents.MapSelectPreview({ ...props, endpoint: OVL_VERLICHTING_LAYER }),
          ({ label, ...props }) => PreviewComponents.CommaArray(props), // remove label from props
        ]),
        optional: true
      },
      extra_straatverlichting_niet_op_kaart: {
        label: 'Staat niet op kaart',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_straatverlichting_niet_op_kaart_nummer: {
        label: 'Lichtpunt(en) niet op kaart',
        render: PreviewComponents.CommaArray,
        optional: true
      },

      extra_afval: {  // actual incident field name
        label: 'Waar vandaan',
        render: PreviewComponents.PlainText,
        optional: true
      },
      extra_container_kind: {
        label: 'Soort container',
        render: PreviewComponents.PlainText,
        optional: true
      },
      extra_container_number: {
        label: 'Container nummer',
        render: PreviewComponents.PlainText,
        optional: true
      },

      // Extra bedrijven overlast questions
      extra_bedrijven_overig: {
        label: 'Melding over',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_bedrijven_naam: {
        label: 'Naam',
        render: PreviewComponents.PlainText,
        optional: true
      },
      extra_bedrijven_adres: {
        label: 'Adres extra',
        render: PreviewComponents.PlainText,
        optional: true
      },
      extra_bedrijven_vaker: {
        label: 'Vaker overlast',
        render: PreviewComponents.ObjectValue,
        optional: true
      },
      extra_bedrijven_momenten: {
        label: 'Momenten',
        render: PreviewComponents.PlainText,
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
