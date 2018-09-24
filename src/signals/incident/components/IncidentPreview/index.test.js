import React from 'react';
import { shallow } from 'enzyme';

import PreviewComponents from '../../components/IncidentPreview/components/';
import IncidentPreview from './index';

describe('<IncidentPreview />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentContainer: {
        incident: {
          phone: '0666 666 666',
          email: 'devil@hell.com'
        }
      },
      preview: {
        part1: {
          phone: {
            label: 'Uw (mobiele) telefoon',
            render: PreviewComponents.PlainText
          }
        },
        part2: {
          email: {
            label: 'Uw e-mailadres',
            render: PreviewComponents.PlainText
          }
        }
      }
    };
  });

  it('expect to render correctly', () => {
    const wrapper = shallow(
      <IncidentPreview {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
