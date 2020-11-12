import { Validators } from 'react-reactive-form';
import memoize from 'lodash/memoize';

import configuration from 'shared/services/configuration/configuration';

import afval from './wizard-step-2-vulaan/afval';
import overlastBedrijvenEnHoreca from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca';
import overlastInDeOpenbareRuimte from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte';
import overlastOpHetWater from './wizard-step-2-vulaan/overlast-op-het-water';
import overlastVanDieren from './wizard-step-2-vulaan/overlast-van-dieren';
import overlastPersonenEnGroepen from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen';
import wegenVerkeerStraatmeubilair from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair';
import wonen from './wizard-step-2-vulaan/wonen';

import FormComponents from '../components/form';
import IncidentNavigation from '../components/IncidentNavigation';

const mapFieldNameToComponent = key => (key === 'IncidentNavigation' ? IncidentNavigation : FormComponents[key]);
const mapValidatorToFn = key => Validators[key];
const expandValidatorFn = ([key, ...args]) => mapValidatorToFn(key)(...args);
const expandValidator = key => (Array.isArray(key) ? expandValidatorFn(key) : mapValidatorToFn(key));

const expandQuestions = memoize(
  questions => ({
    controls: Object.keys(questions).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...questions[key],
          options: {
            validators: (questions[key].options?.validators || []).map(expandValidator),
          },
          render: mapFieldNameToComponent(questions[key].render),
        },
      }),
      {}
    ),
  }),
  (questions, category, subcategory) => `${category}${subcategory}`
);

export default {
  label: 'Dit hebben we nog van u nodig',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  formFactory: ({ category, subcategory, questions }) => {
    const noExtraProps = { controls: {} };
    if (!configuration?.featureFlags.showVulaanControls) return noExtraProps;

    if (configuration.featureFlags.fetchQuestionsFromBackend) {
      return expandQuestions(questions || {}, category, subcategory);
    }

    switch (category) {
      case 'afval':
        return afval;

      case 'overlast-bedrijven-en-horeca':
        return overlastBedrijvenEnHoreca;

      case 'overlast-in-de-openbare-ruimte':
        return overlastInDeOpenbareRuimte;

      case 'overlast-op-het-water':
        return overlastOpHetWater;

      case 'overlast-van-dieren':
        return overlastVanDieren;

      case 'overlast-van-en-door-personen-of-groepen':
        return overlastPersonenEnGroepen;

      case 'wegen-verkeer-straatmeubilair':
        return wegenVerkeerStraatmeubilair;

      case 'wonen':
        return wonen;

      default:
        return noExtraProps;
    }
  },
};
