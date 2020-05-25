import { Validators } from 'react-reactive-form';
import memoize from 'lodash/memoize';

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

const mapFieldNameToComponent = {
  CHECKBOX: FormComponents.CheckboxInput,
  INCIDENT_NAVIGATION: IncidentNavigation,
  PLAIN_TEXT: FormComponents.PlainText,
  RADIO_GROUP: FormComponents.RadioInputGroup,
};

const mapValidatorToFn = {
  REQUIRED: Validators.required,
};

const expandFieldType = key => mapFieldNameToComponent[key];
const expandValidator = key => mapValidatorToFn[key];

const expandQuestions = memoize(questions => ({
  controls: Object.keys(questions).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...questions[key],
        options: {
          validators: (questions[key].options?.validators || []).map(expandValidator),
        },
        render: expandFieldType(questions[key].render),
      },
    }),
    {}
  ),
}));

export default {
  label: 'Dit hebben we nog van u nodig',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  formFactory: ({ category, questions }) => {
    switch (category) {
      case 'afval':
        return afval;

      case '-overlast-bedrijven-en-horeca':
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
        return questions ? expandQuestions(questions) : { controls: {} };
    }
  },
};
