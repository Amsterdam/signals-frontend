import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import SelectInput from '..';

describe('<SelectInput />', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none', slug: '' },
        { key: '1', value: 'item1', slug: 'item-1' },
        { key: '2', value: 'item2', slug: 'item-2' },
      ],
      multiple: false,
      emptyOptionText: 'all items',
      size: 4,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const SelectInputRender = SelectInput(props);
    const { container, queryByTestId } = render(withAppContext(
      <SelectInputRender {...props} />
    ));

    const options = container.firstChild.querySelectorAll('option');
    expect(options).toHaveLength(props.values.length);
    expect(options[0].textContent).toEqual('all items');
    expect(queryByTestId(props.name)).not.toBeNull();
  });

  it('should render correctly with empty option select', () => {
    const emptyOptionText = 'All the things!!1!';
    const SelectInputRender = SelectInput({ ...props, emptyOptionText });
    const { container } = render(withAppContext(
      <SelectInputRender {...props} />
    ));

    const options = container.firstChild.querySelectorAll('option');
    expect(options).toHaveLength(props.values.length);
    expect(options[0].textContent).toEqual(emptyOptionText);
  });

  it('should render correctly with using slugs', () => {
    const useSlug = true;
    const SelectInputRender = SelectInput({ ...props, useSlug });
    const { container } = render(withAppContext(
      <SelectInputRender {...props} />
    ));

    const options = container.firstChild.querySelectorAll('option');
    options.forEach((option, index) => {
      if (!index === 0) {
        expect(option.textContent).toEqual(props.values[index].slug);
      }
    });
  });
});
