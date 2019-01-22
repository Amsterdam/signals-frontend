import React from 'react';

import DefinitionComponents from '../components/';
import FormComponents from '../../components/IncidentForm/components/';
import IncidentNavigation from '../../components/IncidentNavigation';

export default {
  controls: {
    custom_text: {
      meta: {
        label: 'Dit hebt u net ingevuld:',
        type: 'citation',
        value: '{incident.description}',
        ignoreVisibility: true
      },
      render: FormComponents.PlainText
    },

    extra_dieren_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          category: 'overlast-van-dieren'
        },
        type: 'caution',
        value: [
          'Let op: u kunt met dit formulier een melding doen van:',
          <DefinitionComponents.Ul
            items={[
              'dierplagen (ratten, ganzen, duiven, meeuwen,wespen, etc)',
              'dode dieren op straat, met uitzondering van dode huisdieren en dode vogels',
              <DefinitionComponents.Concat
                items={[
                  'Voor dode huisdieren en dode vogels op straat kunt u contact opnemen met ',
                  <DefinitionComponents.A href="https://www.dierenambulance-amsterdam.nl/dieren/">Dierenambulance Amsterdam</DefinitionComponents.A>,
                  '.'
                ]}
              />,
              <DefinitionComponents.Concat
                items={[
                  'Voor alle andere gevallen: bezoek onze pagina: ',
                  <DefinitionComponents.A href="https://www.amsterdam.nl/veelgevraagd/?caseid=%7BC46A5854-3DB0-4D7C-9244-58912C2E0E6A%7D">Melden van zieke, mishandelde en dode dieren, of overlast van dieren</DefinitionComponents.A>,
                  '.'
                ]}
              />
            ]}
          />
        ],
      },
      render: FormComponents.PlainText
    },
    $field_0: {
      isStatic: false,
      render: IncidentNavigation
    }
  }
};
