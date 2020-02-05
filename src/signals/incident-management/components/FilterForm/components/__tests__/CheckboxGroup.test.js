import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import statusJSON from 'signals/incident-management/definitions/statusList';
import CheckboxGroup from '../CheckboxGroup';

describe('signals/incident-management/components/FilterForm/components/CheckboxGroup', () => {
  it('should not render anything', () => {
    const { container } = render(withAppContext(
      <CheckboxGroup label="Label text" name="groupName" options={[]} />
    ));

    expect(container.firstChild).not.toBeInTheDocument();
  });

  it('should render correctly', () => {
    const label = 'Label text';
    const name = 'groupName';
    const { getByText, getByTestId } = render(withAppContext(
      <CheckboxGroup label={label} name={name} options={statusJSON} />
    ));

    expect(getByText(label)).toBeInTheDocument();
    expect(getByTestId(`${name}CheckboxGroup`)).toBeInTheDocument();
  });
});
