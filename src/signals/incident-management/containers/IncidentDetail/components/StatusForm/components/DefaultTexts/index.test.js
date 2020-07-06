import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import DefaultTexts from './index';

describe('<DefaultTexts />', () => {
  let props;

  beforeEach(() => {
    props = {
      status: 'o',
      hasDefaultTexts: true,
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

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('defaultTextsTitle')).toHaveLength(1);
      expect(queryByTestId('defaultTextsTitle')).toHaveTextContent(/^Standaard teksten$/);

      expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(3);
      expect(queryAllByTestId('defaultTextsItemTitle')[0]).toHaveTextContent(/^Titel 1$/);
      expect(queryAllByTestId('defaultTextsItemText')[0]).toHaveTextContent(/^Er is een accu gevonden en deze is meegenomen$/);
      expect(queryAllByTestId('defaultTextsItemTitle')[1]).toHaveTextContent(/^222$/);
      expect(queryAllByTestId('defaultTextsItemText')[1]).toHaveTextContent(/^sdfsdfsdf$/);
      expect(queryAllByTestId('defaultTextsItemTitle')[2]).toHaveTextContent(/^Asbest$/);
      expect(queryAllByTestId('defaultTextsItemText')[2]).toHaveTextContent(/^Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd\.$/);
    });

    it('should not render when wrong status is used', () => {
      props.hasDefaultTexts = false;
      props.defaultTexts = [{
        title: 'Not visible',
        text: 'bla!',
      }];

      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('defaultTextsTitle')).toHaveLength(0);
      expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(0);
    });

    it('should not render when list is empty', () => {
      props.hasDefaultTexts = true;
      props.defaultTexts = [];

      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('defaultTextsTitle')).toHaveLength(0);
      expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(0);
    });

    it('should not render when list has no templates', () => {
      props.hasDefaultTexts = true;
      props.defaultTexts[0].templates = [];

      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );

      expect(queryAllByTestId('defaultTextsTitle')).toHaveLength(0);
      expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(0);
    });
  });

  describe('events', () => {
    it('should call the callback function when button clicked', () => {
      const { queryAllByTestId } = render(
        <DefaultTexts {...props} />
      );
      fireEvent.click(queryAllByTestId('defaultTextsItemButton')[0]);

      expect(props.onHandleUseDefaultText).toHaveBeenCalledTimes(1);
    });
  });
});
