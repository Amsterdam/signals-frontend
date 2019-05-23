import React from 'react';
import { shallow } from 'enzyme';

import ExtraProperties from './index';

describe('<ExtraProperties />', () => {
  let wrapper;
  const props = {
    items: [
      {
        id: 'extra_straatverlichting',
        label: 'Gaat uw melding over één of over meer lampen?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: {
          id: 'meer_lampen',
          label: 'Meer lampen'
        }
      },
      {
        id: 'extra_straatverlichting_wat',
        label: 'Wat is er aan de hand met de lamp(en)?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: [{ id: 'brandt_niet', label: 'Brandt niet' }, { id: 'brandt_overdag', label: 'Brandt overdag' }]
      },
      {
        id: 'extra_straatverlichting_nummer',
        label: 'Hebt u een nummer van (één van) de lamp(en)?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: '42'
      },
      {
        id: 'extra_bedrijven_vaker',
        label: 'Gebeurt het vaker?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: { label: 'Ja, het gebeurt vaker', value: false }
      },
      {
        id: 'extra_bedrijven_gezien',
        label: 'Heeft u het gezien?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: { label: 'Ja, het gebeurt vaker', value: true }
      },
      {
        id: 'lampen',
        label: 'Welke lampen?',
        category_url: '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        answer: [126543, 87654]
      }
    ]
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    wrapper = shallow(<ExtraProperties {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly without items', () => {
    wrapper = shallow(<ExtraProperties />);

    expect(wrapper).toMatchSnapshot();
  });
});
