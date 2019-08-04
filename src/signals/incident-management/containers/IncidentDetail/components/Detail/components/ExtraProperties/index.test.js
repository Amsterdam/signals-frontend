import React from 'react';
import { render } from '@testing-library/react';

import ExtraProperties from './index';

describe('<ExtraProperties />', () => {
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
    const { queryAllByTestId } = render(
      <ExtraProperties {...props} />
    );

    expect(queryAllByTestId('extra-properties-definition')).toHaveLength(6);
    expect(queryAllByTestId('extra-properties-value')).toHaveLength(6);

    expect(queryAllByTestId('extra-properties-definition')[0]).toHaveTextContent('Gaat uw melding over één of over meer lampen?');
    expect(queryAllByTestId('extra-properties-value')[0]).toHaveTextContent('Meer lampen');
    expect(queryAllByTestId('extra-properties-definition')[1]).toHaveTextContent('Wat is er aan de hand met de lamp(en)?');
    expect(queryAllByTestId('extra-properties-value')[1]).toHaveTextContent('Brandt niet, Brandt overdag');
    expect(queryAllByTestId('extra-properties-definition')[2]).toHaveTextContent('Hebt u een nummer van (één van) de lamp(en)?');
    expect(queryAllByTestId('extra-properties-value')[2]).toHaveTextContent('42');
    expect(queryAllByTestId('extra-properties-definition')[3]).toHaveTextContent('Gebeurt het vaker?');
    expect(queryAllByTestId('extra-properties-value')[3]).toHaveTextContent('Nee');
    expect(queryAllByTestId('extra-properties-definition')[4]).toHaveTextContent('Heeft u het gezien?');
    expect(queryAllByTestId('extra-properties-value')[4]).toHaveTextContent('Ja');
    expect(queryAllByTestId('extra-properties-definition')[5]).toHaveTextContent('Welke lampen?');
    expect(queryAllByTestId('extra-properties-value')[5]).toHaveTextContent('126543, 87654');
  });

  it('should render correctly without items', () => {
    const { queryAllByTestId } = render(
      <ExtraProperties />
    );

    expect(queryAllByTestId('extra-properties-definition')).toHaveLength(0);
    expect(queryAllByTestId('extra-properties-value')).toHaveLength(0);
  });
});
