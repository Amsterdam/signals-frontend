// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';

import RadioInput from '.';

describe('<RadioInput />', () => {
  const handler = () => ({ type: 'radio' });
  const props = {
    name: 'priority',
    display: 'Urgentie',
    values: priorityList,
  };
  const RadioInputRender = RadioInput(props);

  it('should render a list of radio buttons', () => {
    const { container } = render(
      withAppContext(<RadioInputRender handler={handler} />)
    );

    expect(container.querySelectorAll('input[type=radio]')).toHaveLength(
      priorityList.length
    );
  });

  it('should display info text', () => {
    const currentValue = priorityList[0];
    const { getByText } = render(
      withAppContext(
        <RadioInputRender handler={handler} value={currentValue.key} />
      )
    );

    expect(getByText(new RegExp(currentValue.info))).toBeInTheDocument();
  });

  it('should not display info text', () => {
    const currentValue = priorityList[0];
    const RenderFunc = RadioInput({
      name: 'priority',
      display: 'Urgentie',
    });

    const { queryByText } = render(
      withAppContext(
        <RenderFunc handler={handler} value={currentValue.key} />
      )
    );

    expect(queryByText(new RegExp(currentValue.info))).not.toBeInTheDocument();
  });

  it('should display a label', () => {
    const { container, rerender } = render(
      withAppContext(<RadioInputRender handler={handler} />)
    );

    expect(
      container.querySelectorAll(`label[for="form${props.name}"]`)
    ).toHaveLength(1);

    const propsWithoutDisplay = { ...props, display: undefined };
    const Render = RadioInput(propsWithoutDisplay);
    rerender(withAppContext(<Render handler={handler} />));

    expect(
      container.querySelectorAll(`label[for="form${props.name}"]`)
    ).toHaveLength(0);
  });
});
