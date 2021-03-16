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

const mapFieldNameToComponent = key => FormComponents[key];
const mapValidatorToFn = key => Validators[key];
const expandValidatorFn = ([key, ...args]) => mapValidatorToFn(key)(...args);
const expandValidator = key => (Array.isArray(key) ? expandValidatorFn(key) : mapValidatorToFn(key));

const expandQuestions = memoize(
  questions => ({
    controls: {
      custom_text: {
        meta: {
          label: 'Dit hebt u net ingevuld:',
          type: 'citation',
          value: '{incident.description}',
          ignoreVisibility: true,
        },
        render: FormComponents.PlainText,
      },
      ...Object.entries(questions).reduce(
        (acc, [key, question]) => ({
          ...acc,
          [key]: {
            ...question,
            options: {
              validators: (question.options?.validators || []).map(expandValidator),
            },
            render: mapFieldNameToComponent(question.render),
          },
        }),
        {}
      ),
      error: {
        meta: {
          label: 'Nog niet alles is correct ingevuld. Volg de meldingen in het rood. Scroll eventueel weer naar boven.',
          ignoreVisibility: true,
        },
        render: FormComponents.Error,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
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
        return expandQuestions(afval, category, subcategory);

      case 'overlast-bedrijven-en-horeca':
        return expandQuestions(overlastBedrijvenEnHoreca, category, subcategory);

      case 'overlast-in-de-openbare-ruimte':
        return expandQuestions(overlastInDeOpenbareRuimte, category, subcategory);

      case 'overlast-op-het-water':
        return expandQuestions(overlastOpHetWater, category, subcategory);

      case 'overlast-van-dieren':
        return expandQuestions(overlastVanDieren, category, subcategory);

      case 'overlast-van-en-door-personen-of-groepen':
        return expandQuestions(overlastPersonenEnGroepen, category, subcategory);

      case 'wegen-verkeer-straatmeubilair':
        return expandQuestions(wegenVerkeerStraatmeubilair, category, subcategory);

      case 'wonen':
        return expandQuestions(wonen, category, subcategory);

      default:
        return noExtraProps;
    }
  },
};
