import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import priorityList from 'signals/incident-management/definitions/priorityList';

import RadioButtonList from '.';

describe('signals/incident-management/components/RadioButtonList', () => {
  it('should render a title', () => {
    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(<RadioButtonList options={priorityList} groupName="priority" />)
    );

    expect(queryByTestId('radioButtonListTitle')).not.toBeInTheDocument();

    rerender(withAppContext(<RadioButtonList options={priorityList} groupName="priority" title="Here be dragons" />));

    expect(getByTestId('radioButtonListTitle')).toBeInTheDocument();
  });

  it('should render empty selection button', () => {
    const { container, rerender } = render(
      withAppContext(<RadioButtonList options={priorityList} groupName="priority" />)
    );

    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(priorityList.length + 1);

    rerender(
      withAppContext(<RadioButtonList options={priorityList} groupName="priority" hasEmptySelectionButton={false} />)
    );

    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(priorityList.length);
  });

  it('should call onChange', () => {
    const onChange = jest.fn();

    const groupName = 'priority';

    const { getByTestId } = render(
      withAppContext(<RadioButtonList options={priorityList} groupName={groupName} onChange={onChange} />)
    );

    expect(onChange).not.toHaveBeenCalled();

    const firstOption = priorityList[0];
    const radio = getByTestId(`${groupName}-${firstOption.key}`);

    act(() => {
      fireEvent.click(radio);
    });

    expect(onChange).toHaveBeenCalledWith(groupName, firstOption);
  });
});
