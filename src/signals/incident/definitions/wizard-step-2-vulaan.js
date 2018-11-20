import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/IncidentForm/components/';

import afval from './wizard-step-2-vulaan/afval';
import overlastBedrijvenEnHoreca from './wizard-step-2-vulaan/overlast-bedrijven-en-horeca';
import overlastInDeOpenbareRuimte from './wizard-step-2-vulaan/overlast-in-de-openbare-ruimte';
import overlastOpHetWater from './wizard-step-2-vulaan/overlast-op-het-water';
import overlastPersonenEnGroepen from './wizard-step-2-vulaan/overlast-van-en-door-personen-of-groepen';
import overlastWegenVerkeerStraatmeubilair from './wizard-step-2-vulaan/wegen-verkeer-straatmeubilair';

export default {
  label: 'Dit hebben we nog van u nodig',
  nextButtonLabel: 'Volgende',
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: 'Vorige',
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      custom_text: {
        meta: {
          label: 'Dit hebt u net ingevuld:',
          type: 'citation',
          value: '{incident.description}'
        },
        render: FormComponents.PlainText
      },

      ...afval,
      ...overlastBedrijvenEnHoreca,
      ...overlastInDeOpenbareRuimte,
      ...overlastOpHetWater,
      ...overlastPersonenEnGroepen,
      ...overlastWegenVerkeerStraatmeubilair,

      $field_0: {
        isStatic: false,
        render: IncidentNavigation
      }
    }
  }
};
