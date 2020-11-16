import { Validators } from 'react-reactive-form';

import FormComponents from '../../../components/form';
import IncidentNavigation from '../../../components/IncidentNavigation';

const intro = {
  custom_text: {
    meta: {
      label: 'Dit hebt u net ingevuld:',
      type: 'citation',
      value: '{incident.description}',
      ignoreVisibility: true,
    },
    render: FormComponents.PlainText,
  },
};

export const controls = {
  extra_bedrijven_horeca_wat: {
    meta: {
      label: 'Uw melding gaat over:',
      shortLabel: 'Soort bedrijf',
    },
    options: { validators: [Validators.required] },
    render: FormComponents.RadioInputGroup,
  },
  extra_bedrijven_horeca_naam: {
    meta: {
      label: 'Wie of wat zorgt voor deze overlast, denkt u?',
      shortLabel: 'Mogelijke veroorzaker',
    },
    render: FormComponents.TextInput,
  },
};

const navigation = {
  $field_0: {
    isStatic: false,
    render: IncidentNavigation,
  },
};

export default {
  controls: {
    ...intro,

    ...controls,

    ...navigation,
  },
};
