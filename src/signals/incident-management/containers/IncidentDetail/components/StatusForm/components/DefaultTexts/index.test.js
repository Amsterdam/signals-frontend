// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import DefaultTexts from '.';

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
    const defaultTexts = [{
      title: 'Not visible',
      text: 'bla!',
    }];

    const { queryAllByTestId } = render(
      <DefaultTexts {...props} defaultTexts={defaultTexts} />
    );

    expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(0);
  });

  it('should not render when list is empty', () => {
    const defaultTexts = [];

    const { queryAllByTestId } = render(
      <DefaultTexts {...props} defaultTexts={defaultTexts} />
    );

    expect(queryAllByTestId('defaultTextsItemText')).toHaveLength(0);
  });

  it('should render notification when list has no templates', () => {
    const defaultTexts = [...props.defaultTexts];
    defaultTexts[0].templates = [];

    const { getByText } = render(
      <DefaultTexts {...props} defaultTexts={defaultTexts} />
    );

    expect(getByText('Er is geen standaard tekst voor deze subcategorie en status combinatie.')).toBeInTheDocument();
  });

  it('should call the callback function when button clicked', () => {
    const { queryAllByTestId } = render(
      <DefaultTexts {...props} />
    );
    fireEvent.click(queryAllByTestId('defaultTextsItemButton')[0]);

    expect(props.onHandleUseDefaultText).toHaveBeenCalledTimes(1);
  });
});
