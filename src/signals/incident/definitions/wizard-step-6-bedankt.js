import React from 'react';
import { Heading } from '@amsterdam/asc-ui';

import IncidentNavigation from '../components/IncidentNavigation';
import FormComponents from '../components/form';

export default {
  label: 'Bedankt!',
  form: {
    controls: {
      text_melding: {
        meta: {
          type: 'bedankt',
          value:
            'Uw melding is bij ons bekend onder nummer: <a href="/manage/incident/{incident.id}">{incident.id}<a>.',
        },
        render: FormComponents.PlainText,
      },
      text: {
        meta: {
          label: 'Wat doen we met uw melding?',
          type: 'bedankt',
        },
        // eslint-disable-next-line
        render: ({ meta: { label } }) => (
          <Heading as="h2" styleAs="h3">
            {label}
          </Heading>
        ),
      },
      text_melding_extra: {
        meta: {
          type: 'bedankt',
          key: 'incident.handling_message',
        },
        render: FormComponents.HandlingMessage,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
};
