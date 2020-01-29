import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';

import categories from 'utils/__tests__/fixtures/categories.json';
import * as definitions from 'signals/incident-management/definitions';
import FilterForm, { defaultSubmitBtnLabel, saveSubmitBtnLabel } from '..';

const dataLists = {
  priority: definitions.priorityList,
  status: definitions.statusList,
  feedback: definitions.feedbackList,
  stadsdeel: definitions.stadsdeelList,
  source: definitions.sourceList,
};

const formProps = {
  onClearFilter: () => {},
  onSaveFilter: () => {},
  categories,
  onSubmit: () => {},
};

describe('signals/incident-management/components/FilterForm', () => {
  it('should render filter fields', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="text"][name="name"]'),
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('input[type="text"][name="address_text"]'),
    ).toHaveLength(1);
  });

  it('should render a refresh checkbox', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          filter={{ options: {} }}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]'),
    ).toBeTruthy();
  });

  it('should handle checking the refresh box', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
          dataLists={dataLists}
        />,
      ),
    );

    fireEvent.click(
      container.querySelector('input[type="checkbox"][name="refresh"]'),
    );

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked,
    ).toBeTruthy();

    fireEvent.click(
      container.querySelector('input[type="checkbox"][name="refresh"]'),
    );

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked,
    ).toBeFalsy();
  });

  it('should render a hidden id field', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          filter={{ id: 1234, name: 'FooBar', options: {} }}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="hidden"][name="id"]'),
    ).toHaveLength(1);

    expect(
      container.querySelector('input[type="hidden"][name="id"]').value,
    ).toEqual('1234');
  });

  it('should render groups of category checkboxes', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    // category groups
    expect(
      container.querySelectorAll(
        'input[type="checkbox"][name="maincategory_slug"]',
      ),
    ).toHaveLength(Object.keys(categories.mainToSub).length);

    Object.keys(categories.mainToSub).forEach(category => {
      expect(
        container.querySelectorAll(
          `input[type="checkbox"][name="${category}_category_slug"]`,
        ),
      ).toHaveLength(Object.keys(categories.mainToSub[category]).length);
    });
  });

  it('should render a list of priority options', () => {
    const dataListsWithoutPriorityList = { ...dataLists };
    delete dataListsWithoutPriorityList.priority;

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithoutPriorityList}
        />,
      ),
    );

    expect(queryByTestId('priorityFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="radio"][name="priority"]'),
    ).toHaveLength(0);

    cleanup();

    const dataListsWithEmptyPriorityList = { ...dataLists };
    dataListsWithEmptyPriorityList.priority = [];

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithEmptyPriorityList}
        />,
      ),
    );

    expect(queryByTestId('priorityFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="radio"][name="priority"]'),
    ).toHaveLength(0);

    cleanup();

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="radio"][name="priority"]'),
    ).toHaveLength(priorityList.length + 1);
  });

  it('should render a list of status options', () => {
    const dataListsWithoutStatusList = { ...dataLists };
    delete dataListsWithoutStatusList.status;

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithoutStatusList}
        />,
      ),
    );

    expect(queryByTestId('statusFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="checkbox"][name="status"]'),
    ).toHaveLength(0);

    cleanup();

    const dataListsWithEmptyStatusList = { ...dataLists };
    dataListsWithEmptyStatusList.status = [];

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithEmptyStatusList}
        />,
      ),
    );

    expect(queryByTestId('statusFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="checkbox"][name="status"]'),
    ).toHaveLength(0);

    cleanup();

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="checkbox"][name="status"]'),
    ).toHaveLength(statusList.length);
  });

  it('should render a list of stadsdeel options', () => {
    const dataListsWithoutStadsdeelList = { ...dataLists };
    delete dataListsWithoutStadsdeelList.stadsdeel;

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithoutStadsdeelList}
        />,
      ),
    );

    expect(queryByTestId('stadsdeelFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]'),
    ).toHaveLength(0);

    cleanup();

    const dataListsWithEmptyStadsdeelList = { ...dataLists };
    dataListsWithEmptyStadsdeelList.stadsdeel = [];

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithEmptyStadsdeelList}
        />,
      ),
    );

    expect(queryByTestId('stadsdeelFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]'),
    ).toHaveLength(0);

    cleanup();

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]'),
    ).toHaveLength(stadsdeelList.length);
  });

  it('should render a list of feedback options', () => {
    const dataListsWithoutFeedbackList = { ...dataLists };
    delete dataListsWithoutFeedbackList.feedback;

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithoutFeedbackList}
        />,
      ),
    );

    expect(queryByTestId('feedbackFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="radio"][name="feedback"]'),
    ).toHaveLength(0);

    cleanup();

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="radio"][name="feedback"]'),
    ).toHaveLength(dataLists.feedback.length + 1); // by default, a radio button with an empty value is rendered
  });

  it('should render a list of source options', () => {
    const dataListsWithoutSourceList = { ...dataLists };
    delete dataListsWithoutSourceList.source;

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataListsWithoutSourceList}
        />,
      ),
    );

    expect(queryByTestId('sourceFilterGroup')).toBeNull();

    expect(
      container.querySelectorAll('input[type="checkbox"][name="source"]'),
    ).toHaveLength(0);

    cleanup();

    rerender(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="checkbox"][name="source"]'),
    ).toHaveLength(dataLists.source.length);
  });

  it('should render datepickers', () => {
    render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    expect(document.getElementById('filter_created_before')).toBeInTheDocument();
    expect(document.getElementById('filter_created_after')).toBeInTheDocument();
  });

  it('should update the state on created before date select', () => {
    render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    const value = '18-12-2018';
    const inputElement = document.getElementById('filter_created_before');

    // selecting a date from the datepicker will render a hidden input
    expect(document.querySelector('input[name=created_before]')).not.toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value } });

    expect(document.querySelector('input[name=created_before]')).toBeInTheDocument();
  });

  it('should update the state on created after date select', () => {
    render(
      withAppContext(
        <FilterForm
          {...formProps}
          dataLists={dataLists}
        />,
      ),
    );

    const value = '23-12-2018';
    const inputElement = document.getElementById('filter_created_after');

    // selecting a date from the datepicker will render a hidden input
    expect(document.querySelector('input[name=created_after]')).not.toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value } });

    expect(document.querySelector('input[name=created_after]')).toBeInTheDocument();
  });

  // Note that jsdom has a bug where `submit` and `reset` handlers are not called when those handlers
  // are defined as callback attributes on the form element. Instead, handlers are invoked when the
  // corresponding buttons are clicked.
  it('should handle reset', () => {
    const onClearFilter = jest.fn();
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          onClearFilter={onClearFilter}
          dataLists={dataLists}
        />,
      ),
    );

    const nameField = container.querySelector(
      'input[type="text"][name="name"]',
    );
    const dateField = container.querySelector('input[id="filter_created_before"]');
    const addressField = container.querySelector(
      'input[type="text"][name="address_text"]',
    );
    const afvalToggle = container.querySelector(
      'input[type="checkbox"][value="afval"]',
    );

    fireEvent.change(nameField, { target: { value: 'My filter' } });
    fireEvent.change(dateField, { target: { value: '1970-01-01' } });
    fireEvent.change(addressField, { target: { value: 'Weesperstraat 113' } });
    fireEvent.click(afvalToggle, new MouseEvent({ bubbles: true }));

    expect(nameField.value).toEqual('My filter');
    expect(dateField.value).not.toBeFalsy();
    expect(addressField.value).not.toBeFalsy();
    expect(afvalToggle.checked).toEqual(true);

    act(() => {
      fireEvent.click(container.querySelector('button[type="reset"]'));
    });

    expect(onClearFilter).toHaveBeenCalled();
    // jsdom hasn't implemented form reset and submit handling, so we cannot test that the fields have been cleared
  });

  it('should handle cancel', () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          onCancel={onCancel}
          dataLists={dataLists}
        />,
      ),
    );

    fireEvent.click(
      getByTestId('cancelBtn'),
      new MouseEvent({ bubbles: true }),
    );

    expect(onCancel).toHaveBeenCalled();
  });

  describe('submit', () => {
    let emit;

    beforeAll(() => {
      ({ emit } = window._virtualConsole);
    });

    beforeEach(() => {
      window._virtualConsole.emit = jest.fn();
    });

    afterAll(() => {
      window._virtualConsole.emit = emit;
    });

    it('should handle submit for new filter', () => {
      const handlers = {
        onSubmit: jest.fn(),
        onSaveFilter: jest.fn(),
      };

      const { container } = render(
        withAppContext(
          <FilterForm
            {...{...formProps, ...handlers}}
            filter={{
              name: '',
              options: { incident_date: '1970-01-01' },
            }}
            dataLists={dataLists}
          />,
        ),
      );

      expect(handlers.onSaveFilter).not.toHaveBeenCalled();
      expect(handlers.onSubmit).not.toHaveBeenCalled();

      const nameField = container.querySelector(
        'input[type="text"][name="name"]',
      );

      fireEvent.click(container.querySelector('button[type="submit"]'));

      expect(handlers.onSubmit).toHaveBeenCalled();
      expect(handlers.onSaveFilter).not.toHaveBeenCalled(); // name field is empty

      fireEvent.change(nameField, { target: { value: 'New name' }});
      fireEvent.click(container.querySelector('button[type="submit"]'));

      expect(handlers.onSaveFilter).toHaveBeenCalledTimes(1);
    });

    it('should handle submit for existing filter', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      const handlers = {
        onUpdateFilter: jest.fn(),
        onSubmit: jest.fn(),
      };

      const { container } = render(
        withAppContext(
          <FilterForm
            {...{...formProps, ...handlers}}
            filter={{
              name: 'My filter',
              options: {
                incident_date_start: '1970-01-01',
              },
            }}
            dataLists={dataLists}
          />,
        ),
      );

      fireEvent.click(container.querySelector('button[type="submit"]'));

      expect(handlers.onUpdateFilter).toHaveBeenCalled();

      const nameField = container.querySelector(
        'input[type="text"][name="name"]',
      );

      handlers.onUpdateFilter.mockReset();

      fireEvent.change(nameField, { target: { value: ' ' } });

      fireEvent.click(container.querySelector('button[type="submit"]'));

      expect(handlers.onUpdateFilter).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();

      window.alert.mockRestore();
    });
  });

  it('should watch for changes in name field value', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          {...formProps}
          filter={{ name: 'My saved filter', options: {} }}
          dataLists={dataLists}
        />,
      ),
    );

    const submitButton = container.querySelector('button[type="submit"]');
    const nameField = container.querySelector(
      'input[type="text"][name="name"]',
    );

    expect(submitButton.textContent).toEqual(defaultSubmitBtnLabel);

    fireEvent.change(nameField, { target: { value: 'My filter' } });

    expect(submitButton.textContent).toEqual(saveSubmitBtnLabel);

    fireEvent.change(nameField, { target: { value: '' } });

    expect(submitButton.textContent).toEqual(saveSubmitBtnLabel);

    fireEvent.change(nameField, { target: { value: 'My saved filter' } });

    expect(submitButton.textContent).toEqual(defaultSubmitBtnLabel);
  });

  it('should respond to changes in form field values', () => {});
});
