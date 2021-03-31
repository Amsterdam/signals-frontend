// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import {
  changeStatusOptionList,
  GEMELD,
  INGEPLAND,
  AFGEHANDELD,
  GEANNULEERD,
} from 'signals/incident-management/definitions/statusList';

import { PATCH_TYPE_STATUS } from '../../../constants';
import IncidentDetailContext from '../../../context';
import StatusForm from '..';
import {
  MELDING_CHECKBOX_DESCRIPTION,
  HEROPENED_EXPLANATION,
  AFGEHANDELD_EXPLANATION,
  GEANNULEERD_EXPLANATION,
  DEELMELDING_EXPLANATION,
  DEELMELDINGEN_STILL_OPEN_HEADING,
  DEELMELDINGEN_STILL_OPEN_CONTENT,
} from '../constants';

const defaultTexts = [
  {
    state: 'ingepland',
    templates: [
      { title: 'Ingepland', text: 'Over 1 dag' },
      { title: 'Ingepland', text: 'Over 2 dagen' },
      { title: '', text: '' },
    ],
  },
  {
    state: 'o',
    templates: [
      { title: 'Niet opgelost', text: 'Geen probleem gevonden' },
      { title: 'Niet opgelost', text: 'Niet voor regio Amsterdam' },
      { title: 'Opgelost', text: 'Lamp vervangen' },
      { title: 'Opgelost', text: 'Lantaarnpaal vervangen' },
    ],
  },
];

const close = jest.fn();
const update = jest.fn();

const renderWithContext = (incident = incidentFixture, childIncidents) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update, close }}>
      <StatusForm defaultTexts={defaultTexts} childIncidents={childIncidents} />
    </IncidentDetailContext.Provider>
  );

const statusSendsEmailWhenSet = changeStatusOptionList
  .filter(({ email_sent_when_set }) => email_sent_when_set)
  .sort(() => 0.5 - Math.random())[0];

const statusDoesNotSendEmailWhenSet = changeStatusOptionList
  .filter(({ email_sent_when_set }) => !email_sent_when_set)
  .sort(() => 0.5 - Math.random())[0];

describe('signals/incident-management/containers/IncidentDetail/components/StatusForm', () => {
  beforeEach(() => {
    close.mockReset();
    update.mockReset();
  });

  it('renders correctly', () => {
    const { container, getByTestId, getByLabelText, getByText } = render(renderWithContext());

    expect(container.querySelector('textarea')).toBeInTheDocument();
    expect(getByTestId('statusFormSubmitButton')).toBeInTheDocument();
    expect(getByTestId('statusFormCancelButton')).toBeInTheDocument();

    Object.values(changeStatusOptionList).forEach(({ value }) => {
      expect(getByLabelText(value)).toBeInTheDocument();
    });

    expect(getByTestId('sendEmailCheckbox')).toBeInTheDocument();
    expect(getByText(MELDING_CHECKBOX_DESCRIPTION)).toBeInTheDocument();
  });

  it('renders a disabled checkbox', () => {
    // render component with incident status that will disable the checkbox
    const { container, getByTestId, queryByText } = render(
      renderWithContext({ ...incidentFixture, status: { state: statusSendsEmailWhenSet.key } })
    );

    // verify that checkbox is checked and disabled
    const checkbox = getByTestId('sendEmailCheckbox');
    expect(checkbox.checked).toEqual(true);
    expect(checkbox.disabled).toEqual(true);

    // verify that the label '(niet verplicht)' is not in the document
    expect(queryByText('(niet verplicht)')).not.toBeInTheDocument();

    // select a status that will not disable the checkbox
    act(() => {
      fireEvent.click(container.querySelector(`input[value="${statusDoesNotSendEmailWhenSet.key}"]`));
    });

    // verify that checkbox is NOT checked and NOT disabled
    expect(checkbox.checked).toEqual(false);
    expect(checkbox.disabled).toEqual(false);

    // verify that the label '(niet verplicht)' is in the document
    expect(queryByText('(niet verplicht)')).toBeInTheDocument();
  });

  it('requires a text value when the checkbox is selected', async () => {
    // render component with incident status that will disable the checkbox
    const { container, getByTestId, queryByText, findByTestId } = render(
      renderWithContext({ ...incidentFixture, status: { state: statusSendsEmailWhenSet.key } })
    );

    // verify that checkbox is checked and disabled
    const checkbox = getByTestId('sendEmailCheckbox');
    expect(checkbox.checked).toEqual(true);
    expect(checkbox.disabled).toEqual(true);

    // submit the form
    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    await findByTestId('statusForm');

    // verify that an error message is shown
    expect(queryByText('Dit veld is verplicht')).toBeInTheDocument();

    // verify that 'update' and 'close' have NOT been called
    expect(update).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();

    // fire onChange event on textarea
    const textarea = container.querySelector('textarea');
    const value = 'Foo bar baz';
    act(() => {
      fireEvent.change(textarea, { target: { value } });
    });

    // verify that an error message is NOT shown
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument();

    // submit the form
    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    await findByTestId('statusForm');

    // verify that 'update' and 'close' have been called
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: PATCH_TYPE_STATUS,
        patch: {
          status: expect.objectContaining({ text: value }),
        },
      })
    );
    expect(close).toHaveBeenCalled();
  });

  it('toggles the requirement for the text field', () => {
    // render component
    const { getByTestId, getByText, queryByText } = render(
      renderWithContext({ ...incidentFixture, status: { state: statusDoesNotSendEmailWhenSet.key } })
    );

    const checkbox = getByTestId('sendEmailCheckbox');

    expect(checkbox.checked).toEqual(false);

    // verify that the label '(niet verplicht)' is in the document
    expect(getByText('(niet verplicht)')).toBeInTheDocument();

    // check the box
    act(() => {
      fireEvent.click(checkbox);
    });

    expect(checkbox.checked).toEqual(true);

    // verify that the label '(niet verplicht)' is not in the document
    expect(queryByText('(niet verplicht)')).not.toBeInTheDocument();

    // toggle the box
    act(() => {
      fireEvent.click(checkbox);
    });

    // verify that the label '(niet verplicht)' is in the document
    expect(getByText('(niet verplicht)')).toBeInTheDocument();
  });

  it('clears the text field when a default text is selected', () => {
    // render component with incident status that will render default texts
    const texts = defaultTexts[0];
    const { container, getByTestId, getAllByTestId } = render(
      renderWithContext({ ...incidentFixture, status: { state: texts.state } })
    );

    // verify that there are default texts visible
    expect(getByTestId('defaultTextsTitle')).toBeInTheDocument();

    // verify that the text field is empty
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toEqual('');

    // click a default text link
    const link = getAllByTestId('defaultTextsItemButton')[0];
    act(() => {
      fireEvent.click(link);
    });

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(texts.templates[0].text);

    // select another status
    act(() => {
      fireEvent.click(container.querySelector(`input[value="${changeStatusOptionList[0].key}"]`));
    });

    // verify that the text field is empty again
    expect(textarea.value).toEqual('');
  });

  it('does not clear the text field when text has been entered manually', () => {
    // render component
    const { container } = render(renderWithContext());

    // verify that the text field is empty
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toEqual('');

    // fire onChange event on textarea
    const value = 'Foo bar baz';
    act(() => {
      fireEvent.change(textarea, { target: { value } });
    });

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(value);

    // select another status
    act(() => {
      fireEvent.click(container.querySelector(`input[value="${changeStatusOptionList[1].key}"]`));
    });

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(value);
  });

  it('shows an error when the text field contains specific characters', async () => {
    // render component
    const { container, getByTestId, queryByTestId, findByTestId } = render(renderWithContext());

    // fire onChange event on textarea with special characters '{{' and '}}'
    const textarea = container.querySelector('textarea');
    const value = 'Foo {{bar}} baz';
    act(() => {
      fireEvent.change(textarea, { target: { value } });
    });

    // verify that an error message is NOT shown
    expect(queryByTestId('statusError')).not.toBeInTheDocument();

    // submit the form
    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    await findByTestId('statusForm');

    // verify that an error message is shown
    expect(getByTestId('statusError')).toBeInTheDocument();

    // verify that 'update' and 'close' have NOT been called
    expect(update).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();

    // fire onChange event on textarea
    const validValue = 'Foo bar baz';
    act(() => {
      fireEvent.change(textarea, { target: { value: validValue } });
    });

    // submit the form
    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    await findByTestId('statusForm');

    // verify that 'update' and 'close' have been called
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: PATCH_TYPE_STATUS,
        patch: {
          status: expect.objectContaining({ text: validValue }),
        },
      })
    );
    expect(close).toHaveBeenCalled();
  });

  it('clears the error message when another status is selected', async () => {
    // render component with incident status that will disable the checkbox
    const { container, getByTestId, queryByTestId, findByTestId } = render(
      renderWithContext({ ...incidentFixture, status: { state: statusSendsEmailWhenSet.key } })
    );

    // verify that an error message is NOT shown
    expect(queryByTestId('statusError')).not.toBeInTheDocument();

    // submit the form
    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    await findByTestId('statusForm');

    // verify that an error message is shown
    expect(getByTestId('statusError')).toBeInTheDocument();

    // select another status
    act(() => {
      fireEvent.click(container.querySelector(`input[value="${changeStatusOptionList[3].key}"]`));
    });

    // verify that an error message is NOT shown
    expect(queryByTestId('statusError')).not.toBeInTheDocument();
  });

  it('shows a warning that is specific to certain statuses', () => {
    // render component
    const { container, getByTestId, queryByTestId, queryByText } = render(renderWithContext());

    expect(queryByText(HEROPENED_EXPLANATION)).not.toBeInTheDocument();

    // select status 'reopened'
    act(() => {
      fireEvent.click(container.querySelector('input[value="reopened"]'));
    });

    // verify that warning with text HEROPENED_EXPLANATION is visible
    expect(getByTestId('statusWarning').textContent).toEqual(HEROPENED_EXPLANATION);

    // select status 'o'
    act(() => {
      fireEvent.click(container.querySelector('input[value="o"]'));
    });

    // verify that warning with text AFGEHANDELD_EXPLANATION is visible
    expect(getByTestId('statusWarning').textContent).toEqual(AFGEHANDELD_EXPLANATION);

    // select status 'a'
    act(() => {
      fireEvent.click(container.querySelector('input[value="a"]'));
    });

    // verify that warning with text GEANNULEERD_EXPLANATION is visible
    expect(getByTestId('statusWarning').textContent).toEqual(GEANNULEERD_EXPLANATION);

    // select a status that is none of the above
    act(() => {
      fireEvent.click(container.querySelector('input[value="b"]'));
    });

    // verify that no warning is shown
    expect(queryByTestId('statusWarning')).not.toBeInTheDocument();
  });

  it('shows a warning that is specific to a deelmelding', () => {
    const deelmelding = {
      ...incidentFixture,
      _links: {
        ...incidentFixture._links,
        'sia:parent': {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/106',
          public: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies',
        },
      },
    };

    // render component with incident that has a parent
    const { container, queryByTestId, getByTestId } = render(renderWithContext(deelmelding));

    // verify that warning with text DEELMELDING_EXPLANATION is visible
    expect(getByTestId('statusExplanation').textContent).toEqual(DEELMELDING_EXPLANATION);
    expect(queryByTestId('statusWarning')).not.toBeInTheDocument();

    // select a status that will show a warning (see: )
    fireEvent.click(container.querySelector('input[value="reopened"]'));

    // verify that statusExplanation is visible
    expect(getByTestId('statusExplanation')).toBeInTheDocument();

    // verify that explanation with text DEELMELDING_EXPLANATION is visible
    expect(getByTestId('statusExplanation').textContent).toEqual(DEELMELDING_EXPLANATION);
  });

  it('shows a warning when there are child incidents still open', async () => {
    const childIncidents = [GEMELD, INGEPLAND].map(({ key }) => ({
      status: { state: key },
    }));
    const { container, queryByTestId, getByTestId } = render(renderWithContext(incidentFixture, childIncidents));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(`input[value="${AFGEHANDELD.key}"]`));

    expect(getByTestId('statusHasChildrenOpen').textContent).toContain(DEELMELDINGEN_STILL_OPEN_HEADING);
    expect(getByTestId('statusHasChildrenOpen').textContent).toContain(DEELMELDINGEN_STILL_OPEN_CONTENT);

    fireEvent.click(container.querySelector(`input[value="${INGEPLAND.key}"]`));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(`input[value="${GEANNULEERD.key}"]`));
    expect(getByTestId('statusHasChildrenOpen').textContent).toContain(DEELMELDINGEN_STILL_OPEN_CONTENT);
    expect(getByTestId('statusHasChildrenOpen').textContent).toContain(DEELMELDINGEN_STILL_OPEN_HEADING);
  });

  it('shows NO warning when the child incidents are closed', async () => {
    const childIncidents = [AFGEHANDELD, GEANNULEERD].map(({ key }) => ({
      status: { state: key },
    }));

    const { container, queryByTestId } = render(renderWithContext(incidentFixture, childIncidents));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(`input[value="${AFGEHANDELD.key}"]`));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(`input[value="${INGEPLAND.key}"]`));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector(`input[value="${GEANNULEERD.key}"]`));

    expect(queryByTestId('statusHasChildrenOpen')).not.toBeInTheDocument();
  });
});
