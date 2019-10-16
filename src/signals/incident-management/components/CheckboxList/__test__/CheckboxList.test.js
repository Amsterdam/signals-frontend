import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import statuses from 'signals/incident-management/definitions/statusList';
import categories from 'utils/__tests__/fixtures/categories.json';

import CheckboxList from '..';

describe('signals/incident-management/components/CheckboxList', () => {
  afterEach(cleanup);

  it('should render a title ', () => {
    const title = 'This is my title';
    const { getByLabelText } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
          title={title}
        />,
      ),
    );

    expect(getByLabelText(title)).toBeTruthy();
  });

  it('should render a toggle', () => {
    const { getAllByLabelText, rerender } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
        />,
      ),
    );

    // should not render a toggle checkbox, expecting number of checkboxes to be equal to the number of options
    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      statuses.length,
    );

    // still shouldn't render a toggle checkbox
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
          toggleLabel="Toggle me"
        />,
      ),
    );

    expect(document.querySelectorAll('input[type="checkbox"]')).toHaveLength(
      statuses.length,
    );

    // now it should
    const toggleFieldName = 'main';
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
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
    const truncated = statuses.slice(0, numOptions);
    const groupName = 'newGroup';

    const { rerender } = render(
      withAppContext(
        <CheckboxList groupName={groupName} groupId={groupName} options={truncated} />,
      ),
    );

    const allBoxes = document.querySelectorAll('input[type="checkbox"]');

    expect(allBoxes).toHaveLength(numOptions);

    allBoxes.forEach(el => {
      expect(el.name).toEqual(groupName);
    });

    const clusterName = 'category_slug';
    // now rendering with a value for the `clusterName` prop
    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
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
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
        />,
      ),
    );

    // nothing should be checked
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
      expect(el.checked).toEqual(false);
    });

    const defaultValue = [statuses[1], statuses[3], statuses[5]];

    cleanup();

    rerender(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
          defaultValue={defaultValue}
        />,
      ),
    );

    const checkedBoxes = Array.from(
      container.querySelectorAll('input[type="checkbox"]'),
    ).filter(el => el.checked);
    expect(checkedBoxes).toHaveLength(defaultValue.length);
  });

  it('should handle toggle interaction', () => {
    const toggleFieldName = 'main';
    const { container, getByLabelText } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
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

    individualBoxes.forEach(el => {
      expect(el.checked).toEqual(true);
    });

    // uncheck the toggle
    fireEvent.click(toggleLabel);

    expect(toggleBox.checked).toEqual(false);
    expect(toggleBox.dataset.value).toEqual('none');

    individualBoxes.forEach(el => {
      expect(el.checked).toEqual(false);
    });
  });

  it('should handle individual checkbox interaction without a toggle checkbox', () => {
    const { container } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
        />,
      ),
    );

    const individualBoxes = container.querySelectorAll(
      'input[type="checkbox"]',
    );

    const singleBox = individualBoxes.item(
      Math.floor(Math.random() * statuses.length),
    );

    fireEvent.click(singleBox);

    expect(singleBox.checked).toEqual(true);

    Array.from(individualBoxes)
      .filter(el => el !== singleBox)
      .forEach(el => {
        expect(el.checked).toEqual(false);
      });
  });

  it('should handle individual checkbox interaction with a toggle checkbox', () => {
    const toggleFieldName = 'main';
    const { container, getByLabelText } = render(
      withAppContext(
        <CheckboxList
          groupName="newGroup"
          groupId="newGroup"
          options={statuses}
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
      Math.floor(Math.random() * statuses.length),
    );

    fireEvent.click(singleBox);

    expect(toggleBox.checked).toEqual(false);
    expect(singleBox.checked).toEqual(false);

    Array.from(individualBoxes)
      .filter(el => el !== singleBox)
      .forEach(el => {
        expect(el.checked).toEqual(true);
      });

    // click the toggle again; this should uncheck all boxes
    fireEvent.click(toggleBox);

    individualBoxes.forEach(el => {
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
          groupId={groupName}
          options={statuses}
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

  it('should give preference to slugs over keys for checkbox values from the incoming data', () => {
    const options = categories.mainToSub.afval;
    const slugs = options.map(({ slug }) => slug);
    const { container, rerender } = render(
      withAppContext(
        <CheckboxList
          defaultValue={options.slice(0, 2)}
          groupName="afval"
          groupId="afval"
          options={options}
          toggleLabel="Toggle me"
          toggleFieldName="main"
        />,
      ),
    );

    container.querySelectorAll('input[type="checkbox"]').forEach(element => {
      expect(slugs.includes(element.value));
    });

    cleanup();

    const keys = statuses.map(({ key }) => key);

    rerender(
      withAppContext(
        <CheckboxList
          defaultValue={statuses.slice(0, 2)}
          groupName="status"
          groupId="status"
          options={statuses}
          toggleLabel="Toggle me"
          toggleFieldName="main"
        />,
      ),
    );

    container.querySelectorAll('input[type="checkbox"]').forEach(element => {
      expect(keys.includes(element.value));
    });
  });
});
