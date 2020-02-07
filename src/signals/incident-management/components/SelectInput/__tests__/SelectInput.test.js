import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories_private.json';
import { filterForSub } from 'models/categories/selectors';

import SelectInput from '..';

const subCategories = categories.results.filter(filterForSub);

describe('signals/incident-management/components/SelectInput', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: subCategories,
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
    const { container, queryByTestId } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    const options = container.firstChild.querySelectorAll('option');
    expect(options).toHaveLength(props.values.length + 1);
    expect(options[0].textContent).toEqual(props.emptyOptionText);
    expect(queryByTestId(props.name)).not.toBeNull();
  });

  it('should render correctly with incorrect value props', () => {
    const subCatsWithoutLinks = subCategories.map(subcat => ({
      ...subcat,
      _links: undefined,
    }));
    const names = subCatsWithoutLinks.map(({ name }) => name).concat(''); // adding empty string for empty option

    const SelectInputRender = SelectInput({
      ...props,
      values: subCatsWithoutLinks,
    });
    const { container } = render(
      withAppContext(<SelectInputRender handler={props.handler} />)
    );

    container.firstChild.querySelectorAll('option').forEach(option => {
      expect(names).toContain(option.value);
    });
  });

  it('should render correctly with multiple select', () => {
    const SelectInputRender = SelectInput({ ...props, multiple: true });
    const { container } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    expect(container.firstChild.querySelector('select[multiple]')).toBeTruthy();
  });

  it('should render correctly with empty option select', () => {
    const emptyOptionText = 'All the things!!1!';
    const SelectInputRender = SelectInput({ ...props, emptyOptionText });
    const { container } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    const options = container.firstChild.querySelectorAll('option');
    expect(options).toHaveLength(props.values.length + 1);
    expect(options[0].textContent).toEqual(emptyOptionText);
  });

  it('should render correctly with using slugs', () => {
    const useSlug = true;
    const SelectInputRender = SelectInput({ ...props, useSlug });
    const { container } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    const options = container.firstChild.querySelectorAll('option');
    options.forEach((option, index) => {
      if (!index === 0) {
        expect(option.textContent).toEqual(props.values[index].slug);
      }
    });
  });

  it('should render correctly with list size smaller than number of values', () => {
    const size = 2;
    const multiple = true;
    const SelectInputRender = SelectInput({ ...props, size, multiple });
    const { container } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    expect(
      container.firstChild.querySelector('select').getAttribute('size')
    ).toEqual(`${size}`);
  });

  it('should render correctly with list size greater than number of values', () => {
    const size = subCategories.length + 1;
    const multiple = true;
    const SelectInputRender = SelectInput({ ...props, size, multiple });
    const { container } = render(
      withAppContext(<SelectInputRender {...props} />)
    );

    expect(
      container.firstChild.querySelector('select').getAttribute('size')
    ).toEqual(`${subCategories.length}`);
  });
});
