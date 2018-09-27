import React from 'react';
import { mount } from 'enzyme';

import IncidentForm from './index';
import formatConditionalForm from './services/format-conditional-form/';
import FormComponents from '../../components/IncidentForm/components/';

jest.mock('./services/format-conditional-form/');

const mockForm = {
  controls: {
    phone: {
      meta: {
        label: 'Wat is uw telefoonnummer?',
        subtitle: 'Zo kunt u ons helpen het probleem sneller of beter op te lossen.',
        path: 'reporter.phone',
        placeholder: 'Telefoonnummer',
        type: 'text',
        isVisible: true
      },
      render: FormComponents.TextInput,
    },
    extra_boten_geluid_meer: {
      meta: {
        label: 'Zijn er nog dingen die u ons nog meer kunt vertellen?',
        pathMerge: 'extra_properties',
        ifAllOf: {
          subcategory: 'Overlast op het water - geluid'
        },
        isVisible: true
      },
      render: FormComponents.TextareaInput
    },
    priority: {
      meta: {
        className: 'col-sm-12 col-md-6',
        label: 'Wat is de urgentie?',
        path: 'priority',
        values: {
          normal: 'Normaal',
          high: 'Hoog'
        },
        isVisible: true
      },
      render: FormComponents.SelectInput
    },
    extra_personen_overig_vaker: {
      meta: {
        className: 'col-sm-12 col-md-6',
        ifAllOf: {
          category: 'Overlast van en door personen of groepen'
        },
        label: 'Gebeurt het vaker?',
        pathMerge: 'extra_properties',
        value: 'Ja, het gebeurt vaker:',
        isVisible: true
      },
      render: FormComponents.CheckboxInput
    },
    subcategory: {
      meta: {
        label: 'Subcategorie',
        path: 'category.sub',
        type: 'text',
        isVisible: true
      },
      render: FormComponents.HiddenInput
    },
    image: {
      meta: {
        label: 'Wilt u een foto meesturen?',
        submitLabel: 'Foto kiezen',
        isVisible: true
      },
      render: FormComponents.FileInput
    },
    privacy_text: {
      meta: {
        className: 'col-sm-12 col-md-6',
        label: 'Uw privacy',
        type: 'disclaimer',
        value: 'We gebruiken uw telefoonnummer alléén om nog iets te kunnen vragen over uw melding. We wissen uw telefoonnummer binnen 2 weken nadat we uw melding hebben afgehandeld.'
      },
      render: FormComponents.PlainText
    },
  }
};

describe('<IncidentForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldConfig: {
        controls: {}
      },
      incidentContainer: {
        incident: {}
      },
      wizard: {

      },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      isAuthenticated: false
    };

    formatConditionalForm.mockImplementation(() => mockForm);
  });

  it('expect to render correctly', () => {
    const wrapper = mount(
      <IncidentForm {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
