import React from 'react';

import DefinitionComponents from '../components';
import FormComponents from '../../components/form';
import IncidentNavigation from '../../components/IncidentNavigation';

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
  extra_jongeren_text: {
    meta: {
      className: 'col-sm-12 col-md-6',
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
        subcategory: 'jongerenoverlast',
      },
      type: 'caution',
      value: [
        <DefinitionComponents.Concat
          items={[
            'Weet u de naam van de jongere(n)? Gebruik dan het formulier ',
            <DefinitionComponents.Anchor href="https://www.amsterdam.nl/zorg-ondersteuning/contact/meldpunt-zorg/">
              Melding zorg en woonoverlast
            </DefinitionComponents.Anchor>,
            '. Dan komt uw melding direct bij het juiste team terecht.',
          ]}
        />,
      ],
    },
    render: FormComponents.PlainText,
  },
  extra_personen_overig: {
    meta: {
      className: 'col-sm-12 col-md-6',
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
      },
      label: 'Om hoe veel personen gaat het (ongeveer)?',
      shortLabel: 'Aantal personen',
      pathMerge: 'extra_properties',
      values: {
        '1-3': '1 - 3',
        '4-6': '4 - 6',
        '7_of_meer': '7 of meer',
        onbekend: 'Onbekend',
      },
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_personen_overig_vaker: {
    meta: {
      className: 'col-sm-12 col-md-6',
      ifAllOf: {
        category: 'overlast-van-en-door-personen-of-groepen',
      },
      label: 'Gebeurt het vaker?',
      shortLabel: 'Vaker',
      pathMerge: 'extra_properties',
      values: {
        nee: 'Nee',
        ja: 'Ja, het gebeurt vaker:',
      },
    },
    render: FormComponents.RadioInputGroup,
  },
  extra_personen_overig_vaker_momenten: {
    meta: {
      label: 'Geef aan op welke momenten het gebeurt',
      shortLabel: 'Momenten',
      pathMerge: 'extra_properties',
      ifAllOf: {
        extra_personen_overig_vaker: 'ja',
        category: 'overlast-van-en-door-personen-of-groepen',
      },
    },
    render: FormComponents.TextareaInput,
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
