import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import SelectInput from '..';

describe('<SelectInput />', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'select',
      onChange: jest.fn(),
      options: [
        { key: 'all', name: 'Alles', value: '*' },
        { key: 'active', name: 'Actief', value: true },
        { key: 'inactive', name: 'Niet actief', value: false },
      ],
      value: '*',
      label: 'Foo',
    };
  });

  afterEach(() => { jest.resetAllMocks(); });

  it('should render correctly', () => {
    const { container } = render(withAppContext(<SelectInput {...props} />));

    const options = container.querySelectorAll('option');
    expect(options).toHaveLength(props.options.length);
    expect(options[0].textContent).toEqual('Alles');
  });

  it('should call onChange prop', () => {
    const onChangeMock = jest.fn();
    const { container } = render(<SelectInput {...props} onChange={onChangeMock} />);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    onChangeMock.mockReset();

    const select = container.querySelector('select');
    select.value = 'active';
    fireEvent.change(select);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
