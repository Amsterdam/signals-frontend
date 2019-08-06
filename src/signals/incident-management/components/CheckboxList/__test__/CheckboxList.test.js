import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import options from 'signals/incident-management/definitions/statusList';

import CheckboxList from '../';

describe('signals/incident-management/components/CheckboxList', () => {
  afterEach(cleanup);

  it('should render a title ', () => {
    const title = 'This is my title';
    const { getByLabelText } = render(
      withAppContext(
        <CheckboxList groupName="newGroup" options={options} title={title} />,
      ),
    );

    expect(getByLabelText(title)).toBeTruthy();
  });

  it('should render a toggle', () => {
    const { getAllByLabelText, rerender } = render(
      withAppContext(<CheckboxList groupName="newGroup" options={options} />),
    );

    // should not render a toggle checkbox, expecting number of checkboxes to be equal to the number of options
    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      options.length,
    );

    // still shouldn't render a toggle checkbox
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={options}
          toggleLabel="Toggle me"
        />,
      ),
    );

    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      options.length,
    );

    // now it should
    const toggleFieldName = 'main';
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={options}
          toggleLabel="Toggle me"
          toggleFieldName={toggleFieldName}
        />,
      ),
    );

    expect(getAllByLabelText('Toggle me')).toHaveLength(1);
    expect(
      document.querySelector(`input[name="${toggleFieldName}"]`),
    ).toBeTruthy();
  });

  it('should render a list of checkboxes ', () => {
    const numOptions = 5;
    const truncated = options.slice(0, numOptions);
    const groupName = 'newGroup';

    const { rerender } = render(
      withAppContext(
        <CheckboxList groupName={groupName} options={truncated} />,
      ),
    );

    const allBoxes = document.querySelectorAll('input[type="checkbox"]');

    expect(allBoxes).toHaveLength(numOptions);

    allBoxes.forEach((el) => {
      expect(el.name).toEqual(groupName);
    });

    const clusterName = 'sub_slug';
    // now rendering with a value for the `clusterName` prop
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={truncated}
          clusterName={clusterName}
        />,
      ),
    );

    const boxesWithClusterName = document.querySelectorAll(
      `input[type="checkbox"][name$="${clusterName}"]`,
    );

    expect(boxesWithClusterName).toHaveLength(numOptions);
  });

  it('should set default checked', () => {
    const { container, rerender } = render(
      withAppContext(<CheckboxList groupName="newGroup" options={options} />),
    );

    // nothing should be checked
    document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      expect(el.checked).toEqual(false);
    });

    const defaultValue = [options[1], options[3], options[5]];

    cleanup();

    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={options}
          defaultValue={defaultValue}
        />,
      ),
    );

    const checkedBoxes = Array.from(
      container.querySelectorAll('input[type="checkbox"]'),
    ).filter((el) => el.checked);
    expect(checkedBoxes).toHaveLength(defaultValue.length);
  });

  it('should handle toggle interaction', () => {
    const toggleFieldName = 'main';
    const { container, getByLabelText } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={options}
          toggleLabel="Toggle me"
          toggleFieldName={toggleFieldName}
        />,
      ),
    );

    const toggleLabel = getByLabelText('Toggle me');
    const toggleBox = container.querySelector(
      `input[type="checkbox"][name="${toggleFieldName}"]`,
    );
    const individualBoxes = container.querySelectorAll(
      `input[type="checkbox"]:not([name="${toggleFieldName}"])`,
    );

    expect(toggleBox.dataset.value).toEqual('none');

    // check the toggle
    fireEvent.click(toggleLabel);

    expect(toggleBox.checked).toEqual(true);
    expect(toggleBox.dataset.value).toEqual('all');

    individualBoxes.forEach((el) => {
      expect(el.checked).toEqual(true);
    });

    // uncheck the toggle
    fireEvent.click(toggleLabel);

    expect(toggleBox.checked).toEqual(false);
    expect(toggleBox.dataset.value).toEqual('none');

    individualBoxes.forEach((el) => {
      expect(el.checked).toEqual(false);
    });
  });

  it('should handle individual checkbox interaction without a toggle checkbox', () => {
    const { container } = render(
      withAppContext(<CheckboxList groupName="newGroup" options={options} />),
    );

    const individualBoxes = container.querySelectorAll(
      'input[type="checkbox"]',
    );

    const singleBox = individualBoxes.item(
      Math.floor(Math.random() * options.length),
    );

    fireEvent.click(singleBox);

    expect(singleBox.checked).toEqual(true);

    Array.from(individualBoxes)
      .filter((el) => el !== singleBox)
      .forEach((el) => {
        expect(el.checked).toEqual(false);
      });
  });

  it('should handle individual checkbox interaction with a toggle checkbox', () => {
    const toggleFieldName = 'main';
    const { container, getByLabelText } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          options={options}
          toggleLabel="Toggle me"
          toggleFieldName={toggleFieldName}
        />,
      ),
    );

    const toggleLabel = getByLabelText('Toggle me');
    const toggleBox = container.querySelector(
      `input[type="checkbox"][name="${toggleFieldName}"]`,
    );
    const individualBoxes = container.querySelectorAll(
      `input[type="checkbox"]:not([name="${toggleFieldName}"])`,
    );

    // check the toggle so that all boxes are checked
    fireEvent.click(toggleLabel);

    // click one of the checkboxes in the list. This should deselect the toggle and leave all the other boxes checked
    const singleBox = individualBoxes.item(
      Math.floor(Math.random() * options.length),
    );

    fireEvent.click(singleBox);

    expect(toggleBox.checked).toEqual(false);
    expect(singleBox.checked).toEqual(false);

    Array.from(individualBoxes)
      .filter((el) => el !== singleBox)
      .forEach((el) => {
        expect(el.checked).toEqual(true);
      });

    // click the toggle again; this should uncheck all boxes
    fireEvent.click(toggleBox);

    individualBoxes.forEach((el) => {
      expect(el.checked).toEqual(false);
    });
  });

  it('should check if toggle should be toggled on mount', () => {
    const groupName = 'newGroup';
    const defaultValue = [
      {
        key: groupName,
        value: 'New group',
      },
    ];
    const toggleFieldName = 'main';
    const { container } = render(
      withAppContext(
        <CheckboxList
          defaultValue={defaultValue}
          groupName={groupName}
          options={options}
          toggleLabel="Toggle me"
          toggleFieldName={toggleFieldName}
        />,
      ),
    );

    const toggleBox = container.querySelector(
      `input[type="checkbox"][name="${toggleFieldName}"]`,
    );

    expect(toggleBox.checked).toEqual(true);
    expect(toggleBox.dataset.value).toEqual('all');
  });
});
