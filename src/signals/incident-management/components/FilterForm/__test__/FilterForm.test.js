import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList from 'signals/incident-management/definitions/statusList';
import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';

import categories from 'utils/__tests__/fixtures/categories.json';
import FilterForm, { defaultSubmitBtnLabel, saveSubmitBtnLabel } from '..';

describe('signals/incident-management/components/FilterForm', () => {
  afterEach(cleanup);

  it('should render filter fields', () => {
    const { container } = render(
      withAppContext(
        <FilterForm categories={categories} onSubmit={() => {}} />,
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
          categories={categories}
          onSubmit={() => {}}
          activeFilter={{}}
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
          categories={categories}
          onSubmit={() => {}}
          activeFilter={{ id: 1234, name: 'FooBar' }}
        />,
      ),
    );

    fireEvent.click(container.querySelector('input[type="checkbox"][name="refresh"]'));

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked,
    ).toBeTruthy();


    fireEvent.click(container.querySelector('input[type="checkbox"][name="refresh"]'));

    expect(
      container.querySelector('input[type="checkbox"][name="refresh"]').checked,
    ).toBeFalsy();
  });

  it('should render a hidden id field', () => {
    const { container } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          onSubmit={() => {}}
          activeFilter={{ id: 1234, name: 'FooBar' }}
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

  it('should render buttons in the footer', () => {
    const { container, getAllByTestId } = render(
      withAppContext(
        <FilterForm categories={categories} onSubmit={() => {}} />,
      ),
    );

    expect(container.querySelectorAll('button[type="reset"]')).toHaveLength(1);
    expect(container.querySelectorAll('button[type="submit"]')).toHaveLength(1);
    expect(getAllByTestId('cancelBtn')).toHaveLength(1);
  });

  it('should render groups of category checkboxes', () => {
    const { container } = render(
      withAppContext(
        <FilterForm categories={categories} onSubmit={() => {}} />,
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
    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          priorityList={null}
          onSubmit={() => {}}
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
          categories={categories}
          priorityList={[]}
          onSubmit={() => {}}
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
          categories={categories}
          priorityList={priorityList}
          onSubmit={() => {}}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="radio"][name="priority"]'),
    ).toHaveLength(priorityList.length + 1);
  });

  it('should render a list of status options', () => {
    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          statusList={null}
          onSubmit={() => {}}
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
          categories={categories}
          statusList={[]}
          onSubmit={() => {}}
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
          categories={categories}
          statusList={statusList}
          onSubmit={() => {}}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="checkbox"][name="status"]'),
    ).toHaveLength(statusList.length);
  });

  it('should render a list of stadsdeel options', () => {
    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          stadsdeelList={[]}
          onSubmit={() => {}}
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
          categories={categories}
          stadsdeelList={[]}
          onSubmit={() => {}}
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
          categories={categories}
          stadsdeelList={stadsdeelList}
          onSubmit={() => {}}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="checkbox"][name="stadsdeel"]'),
    ).toHaveLength(stadsdeelList.length);
  });

  it('should render a list of feedback options', () => {
    const feedback = [
      {
        key: 'meh',
        value: 'Could be better',
      },
      {
        key: '🥳',
        value: 'Yeah!!1!',
      },
    ];

    const { container, rerender, queryByTestId } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          onSubmit={() => {}}
          feedbackList={[]}
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
          categories={categories}
          onSubmit={() => {}}
          feedbackList={feedback}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="radio"][name="feedback"]'),
    ).toHaveLength(feedback.length + 1); // by default, a radio button with an empty value is rendered
  });

  it('should render a datepicker', () => {
    const { container, rerender } = render(
      withAppContext(
        <FilterForm categories={categories} onSubmit={() => {}} />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="hidden"][name="incident_date"]'),
    ).toHaveLength(0);

    expect(document.getElementById('filter_date')).toBeTruthy();

    cleanup();

    // rerendering, because react-datepicker interaction isn't testable
    rerender(
      withAppContext(
        <FilterForm
          categories={categories}
          activeFilter={{ options: { incident_date: '1970-01-01' } }}
          onSubmit={() => {}}
        />,
      ),
    );

    expect(
      container.querySelectorAll('input[type="hidden"][name="incident_date"]'),
    ).toHaveLength(1);
  });

  // Note that jsdom has a bug where `submit` and `reset` handlers are not called when those handlers
  // are defined as callback attributes on the form element. Instead, handlers are invoked when the
  // corresponding buttons are clicked.
  it('should handle reset', async () => {
    const onClearFilter = jest.fn();
    const { container } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          onClearFilter={onClearFilter}
          onSubmit={() => {}}
        />,
      ),
    );

    const nameField = container.querySelector(
      'input[type="text"][name="name"]',
    );
    const dateField = container.querySelector('input[id="filter_date"]');
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

    expect(nameField.value).not.toBeFalsy();
    expect(dateField.value).not.toBeFalsy();
    expect(addressField.value).not.toBeFalsy();
    expect(afvalToggle.checked).toEqual(true);

    fireEvent.click(container.querySelector('button[type="reset"]'));

    expect(onClearFilter).toHaveBeenCalled();
    // jsdom hasn't implemented form reset and submit handling, so we cannot test that the fields have been cleared
  });

  it('should handle cancel', () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      withAppContext(
        <FilterForm
          categories={categories}
          onCancel={onCancel}
          onSubmit={() => {}}
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
            categories={categories}
            {...handlers}
            activeFilter={{
              name: '',
              options: { incident_date: '1970-01-01' },
            }}
          />,
        ),
      );

      fireEvent.click(container.querySelector('button[type="submit"]'));

      expect(handlers.onSaveFilter).not.toHaveBeenCalled();
      expect(handlers.onSubmit).toHaveBeenCalled();
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
            categories={categories}
            {...handlers}
            activeFilter={{
              name: 'My filter',
              options: {
                incident_date_start: '1970-01-01',
              },
            }}
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
          categories={categories}
          activeFilter={{ name: 'My saved filter' }}
          onSubmit={() => {}}
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
