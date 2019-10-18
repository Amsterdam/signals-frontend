import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

import DefaultTexts from './index';

describe('<DefaultTexts />', () => {
  let props;

  beforeEach(() => {
    props = {
      status: 'o',
      defaultTexts: [{
        state: 'o',
        templates: [
          {
            title: 'Titel 1',
            text: 'Er is een accu gevonden en deze is meegenomen',
          },
          {
            title: '222',
            text: 'sdfsdfsdf',
          },
          {
            title: 'Asbest',
            text: 'Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd.',
          },
        ],
      }],
      onHandleUseDefaultText: jest.fn(),
    };
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('default-texts-title')).toHaveLength(1);
      expect(queryByTestId('default-texts-title')).toHaveTextContent(/^Standaard teksten$/);

      expect(queryAllByTestId('default-texts-item')).toHaveLength(3);
      expect(queryAllByTestId('default-texts-item-title')[0]).toHaveTextContent(/^Titel 1$/);
      expect(queryAllByTestId('default-texts-item-text')[0]).toHaveTextContent(/^Er is een accu gevonden en deze is meegenomen$/);
      expect(queryAllByTestId('default-texts-item-title')[1]).toHaveTextContent(/^222$/);
      expect(queryAllByTestId('default-texts-item-text')[1]).toHaveTextContent(/^sdfsdfsdf$/);
      expect(queryAllByTestId('default-texts-item-title')[2]).toHaveTextContent(/^Asbest$/);
      expect(queryAllByTestId('default-texts-item-text')[2]).toHaveTextContent(/^Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd\.$/);
    });

    it('should not render when list is empty', () => {
      props.defaultTexts = [];
      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('default-texts-title')).toHaveLength(0);
      expect(queryAllByTestId('default-texts-item')).toHaveLength(0);
    });
  });

  describe('events', () => {
    it('should download document', () => {
      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );
      fireEvent.click(queryAllByTestId('default-texts-item-button')[0]);

      expect(props.onHandleUseDefaultText).toHaveBeenCalledTimes(1);
    });
  });
});
