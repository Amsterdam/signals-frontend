import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components';
import { controls as wonenControls } from './wizard-step-2-vulaan/wonen';
import { controls as overlastBedrijvenHorecaControls } from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca';
import { controls as overlastOpenbareRuimteControls } from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte';
import { controls as overlastOpHetWaterControls } from './wizard-step-2-vulaan/overlast-op-het-water';
import { controls as wegenVerkeerStraatmeubilairControls } from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair';
import { controls as afvalControls } from './wizard-step-2-vulaan/afval';
import { controls as overlastPersonenGroepenControls } from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen';

export const ObjectLabel = ({ value }) => value.label;
export const Label = ({ value }) => value;
export const SCSVLabel = ({ value }) => value.join('; ');
export const Null = () => null;

export const renderPreview = ({ render: renderFunc, meta }) => {
  switch (renderFunc.name) {
    case 'RadioInputGroup':
      return ObjectLabel;

    case 'CheckboxInput':
      return PreviewComponents.ListObjectValue;

    case 'MultiTextInput':
      return SCSVLabel;

    case 'MapSelect':
      return props => PreviewComponents.MapSelectPreview({ ...props, endpoint: meta.endpoint });

    case 'TextInput':
    case 'TextareaInput':
      return Label;

    default:
      return Null;
  }
};

export const summary = controls =>
  Object.entries(controls).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key]: {
        label: val.meta.shortLabel,
        optional: true,
        render: renderPreview(val),
      },
    }),
    {}
  );

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
        render: IncidentNavigation,
      },
    },
  },
  preview: {
    beschrijf: {
      source: {
        label: 'Bron',
        render: ({ value }) => value.label,
        authenticated: true,
      },
      priority: {
        label: 'Urgentie',
        render: ({ value }) => value.label,
        authenticated: true,
      },
      location: {
        label: 'Locatie',
        render: PreviewComponents.Map,
      },
      description: {
        label: 'Beschrijving',
        render: ({ value }) => value,
      },
      datetime: {
        label: 'Tijdstip',
        render: PreviewComponents.DateTime,
      },
      images_previews: {
        label: 'Foto',
        render: PreviewComponents.Image,
        optional: true,
      },
    },

    vulaan: {
      ...summary(wegenVerkeerStraatmeubilairControls),

      ...summary(afvalControls),

      ...summary(overlastOpenbareRuimteControls),

      ...summary(overlastOpHetWaterControls),

      ...summary(overlastPersonenGroepenControls),

      ...summary(overlastBedrijvenHorecaControls),

      ...summary(wonenControls),
    },

    telefoon: {
      phone: {
        label: 'Uw telefoonnummer',
        render: ({ value }) => value,
      },
    },

    email: {
      email: {
        label: 'Uw e-mailadres',
        render: ({ value }) => value,
      },
    },
  },
};
