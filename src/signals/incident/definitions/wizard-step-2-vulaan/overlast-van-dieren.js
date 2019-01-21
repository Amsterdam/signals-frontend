/* eslint-disable */
import React from 'react';

import FormComponents from '../../components/IncidentForm/components/';
import IncidentNavigation from '../../components/IncidentNavigation';

const Concat = ({ items }) =>
  (<span>{items && items.map && items.map((item) => (<span key={item}>{item}</span>))}</span>);

const A = ({ href, target, className, children }) =>
  (<a href={href} className={className} target={target}>{children}</a>);

const Ul = ({ items }) =>
  (<ul>{items && items.map && items.map((item) => (<li key={item}>{item}</li>))}</ul>);

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
          <Ul items={[
            'dierplagen (ratten, ganzen, duiven, meeuwen,wespen, etc)',
            'dode dieren op straat, met uitzondering van dode huisdieren en dode vogels',
            'voor dode huisdieren en dode vogels op straat kunt u contact opnemen met Dierenambulance',
            <Concat
              items={[
                'Voor alle andere gevallen: bezoek onze pagina: ',
                <A target="_blank" href="http://xs4al.nl">Melden van zieke, mishandelde en dode dieren, of overlast van dieren</A>
              ]}
            />
          ]} />,
          // {
            // type: 'more-link',
            // label: 'Dierenambulance Amsterdam',
            // href: 'http://ns.nl/klantenservice'
          // },
          // {
            // type: 'more-link',
            // label: 'Melden van zieke, mishandelde en dode dieren, of overlast van dieren',
            // href: 'http://ns.nl/klantenservice'
          // }
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
