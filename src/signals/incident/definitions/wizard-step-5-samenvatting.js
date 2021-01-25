import memoize from 'lodash/memoize';

import configuration from 'shared/services/configuration/configuration';

import IncidentNavigation from '../components/IncidentNavigation';
import PreviewComponents from '../components/IncidentPreview/components';
import { controls as wonenControls } from './wizard-step-2-vulaan/wonen';
import { controls as overlastBedrijvenEnHorecaControls } from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca';
import { controls as overlastInDeOpenbareRuimteControls } from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte';
import { controls as overlastOpHetWaterControls } from './wizard-step-2-vulaan/overlast-op-het-water';
import { controls as wegenVerkeerStraatmeubilairControls } from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair';
import { controls as afvalControls } from './wizard-step-2-vulaan/afval';
import { controls as overlastPersonenEnGroepenControls } from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen';
import FormComponents from '../components/form';

export const ObjectLabel = ({ value }) => value?.label;
export const Label = ({ value }) => value;
export const SCSVLabel = ({ value }) => value.filter(Boolean).join('; ');
export const Null = () => null;
const mapFieldNameToComponent = key => FormComponents[key];

export const renderPreview = ({ render: renderFunc, meta }) => {
  const Preview = props => PreviewComponents.ContainerListPreview({ ...props, featureTypes: meta.featureTypes });
  switch (renderFunc.name) {
    case 'RadioInputGroup':
    case 'SelectInput':
      return ObjectLabel;

    case 'CheckboxInput':
      if (meta?.values) {
        return PreviewComponents.ListObjectValue;
      }

      return () => 'Ja';

    case 'MultiTextInput':
      return SCSVLabel;

    case 'MapSelect':
    case 'MapSelectGeneric':
      return props => PreviewComponents.MapSelectPreview({ ...props, meta });

    case 'TextInput':
    case 'TextareaInput':
      return Label;

    case 'ContainerSelectRenderer':
      return Preview;
      // return props => PreviewComponents.ContainerListPreview({ ...props, featureTypes: meta.featureTypes });

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

const expandQuestions = memoize(
  questions =>
    Object.entries(questions).reduce(
      (acc, [key, question]) => ({
        ...acc,
        [key]: {
          label: question.meta.shortLabel || question.meta.label,
          optional: !question.required,
          render: renderPreview({ render: mapFieldNameToComponent(question.render), meta: question.meta }),
        },
      }),
      {}
    ),
  (questions, category, subcategory) => `${category}${subcategory}`
);

const getExtraQuestions = (category, subcategory, questions) => {
  if (!configuration?.featureFlags.showVulaanControls) return {};

  if (configuration.featureFlags.fetchQuestionsFromBackend) {
    return expandQuestions(questions || {}, category, subcategory);
  }

  switch (category) {
    case 'afval':
      return summary(afvalControls);

    case 'overlast-bedrijven-en-horeca':
      return summary(overlastBedrijvenEnHorecaControls);

    case 'overlast-in-de-openbare-ruimte':
      return summary(overlastInDeOpenbareRuimteControls);

    case 'overlast-op-het-water':
      return summary(overlastOpHetWaterControls);

    case 'overlast-van-en-door-personen-of-groepen':
      return summary(overlastPersonenEnGroepenControls);

    case 'wegen-verkeer-straatmeubilair':
      return summary(wegenVerkeerStraatmeubilairControls);

    case 'wonen':
      return summary(wonenControls);

    default:
      return {};
  }
};

export default {
  label: 'Controleer uw gegevens',
  subheader: 'Maak een aanpassing als dat nodig is.',
  nextButtonLabel: 'Verstuur',
  nextButtonClass: 'action primary',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  sectionLabels: {
    heading: {
      beschrijf: 'Melding',
      vulaan: 'Aanvullende informatie',
    },
    edit: {
      beschrijf: 'Wijzig melding',
      vulaan: 'Wijzig aanvullende informatie',
      telefoon: 'Wijzig uw telefoonnummer',
      email: 'Wijzig uw e-mailadres',
    },
  },
  formAction: 'CREATE_INCIDENT',
  form: {
    controls: {
      page_summary: {
        meta: {
          value: 'summary',
        },
        render: FormComponents.HiddenInput,
      },
      sharing_allowed: {
        meta: {
          shortLabel: 'Toestemming contactgegevens delen',
          value: configuration.language?.consentToContactSharing,
          path: 'reporter.sharing_allowed',
        },
        render: FormComponents.EmphasisCheckboxInput,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
  previewFactory: ({ category, subcategory, questions }) => ({
    beschrijf: {
      source: {
        label: 'Bron',
        render: ({ value }) => value?.label,
        authenticated: true,
      },
      priority: {
        label: 'Urgentie',
        render: ({ value }) => value?.label,
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
      classification: {
        label: 'Subcategorie',
        render: ({ value }) => value?.name,
        authenticated: true,
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

    vulaan: getExtraQuestions(category, subcategory, questions),

    telefoon: {
      phone: {
        label: 'Uw telefoonnummer',
        optional: true,
        render: ({ value }) => value,
      },
    },

    email: {
      email: {
        label: 'Uw e-mailadres',
        optional: true,
        render: ({ value }) => value,
      },
    },
  }),
};
