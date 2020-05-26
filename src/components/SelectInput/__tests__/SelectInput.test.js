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

    const options = container.firstChild.querySelectorAll('option');
    expect(options).toHaveLength(props.options.length);
    expect(options[0].textContent).toEqual('Alles');
  });

  it('should call onChange prop', () => {
    const onChangeMock = jest.fn();
    const { container } = render(<SelectInput {...props} onChange={onChangeMock} />);

    fireEvent.change(container.querySelector('select'), { target: { value: 'active' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
