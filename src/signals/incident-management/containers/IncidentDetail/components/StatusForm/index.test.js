import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import { changeStatusOptionList } from '../../../../definitions/statusList';

import StatusForm from '.';

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

const onClose = jest.fn();
const onPatchIncident = jest.fn();

describe('signals/incident-management/containers/IncidentDetail/components/StatusForm', () => {
  beforeEach(() => {
    onClose.mockReset();
    onPatchIncident.mockReset();
  });

  it('renders correctly', () => {
    const { container, getByTestId, getByText } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    expect(container.querySelector('textarea')).toBeInTheDocument();
    expect(getByTestId('statusFormSubmitButton')).toBeInTheDocument();
    expect(getByTestId('statusFormCancelButton')).toBeInTheDocument();

    Object.values(changeStatusOptionList).forEach(({ value }) => {
      expect(getByText(value)).toBeInTheDocument();
    });
  });

  it('shows default texts', () => {
    const stateWithTexts = defaultTexts[0].state;

    const { getByText, getByTestId, queryByTestId } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    const radioButton = getByTestId(`status-${stateWithTexts}`);

    expect(queryByTestId('defaultTextsTitle')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(radioButton);
    });

    expect(queryByTestId('defaultTextsTitle')).toBeInTheDocument();

    Object.values(defaultTexts[0].templates).forEach(({ text }) => {
      if (text) expect(getByText(text)).toBeInTheDocument();
    });
  });

  it('does not show default texts', () => {
    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    expect(queryByTestId('defaultTextsTitle')).not.toBeInTheDocument();

    act(() => {
      changeStatusOptionList.forEach(({ key }) => {
        const radioButton = getByTestId(`status-${key}`);
        fireEvent.click(radioButton);

        expect(queryByTestId('defaultTextsTitle')).not.toBeInTheDocument();
      });
    });
  });

  it('applies default text selection', () => {
    const stateWithTexts = defaultTexts[0].state;

    const { container, getByTestId, getAllByTestId } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    const radioButton = getByTestId(`status-${stateWithTexts}`);

    act(() => {
      fireEvent.click(radioButton);
    });

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toEqual('');

    act(() => {
      fireEvent.click(radioButton);
    });

    const useTextButton1 = getAllByTestId('defaultTextsItemButton')[0];

    act(() => {
      fireEvent.click(useTextButton1);
    });

    expect(textarea.value).toEqual(defaultTexts[0].templates[0].text);

    const useTextButton2 = getAllByTestId('defaultTextsItemButton')[1];

    act(() => {
      fireEvent.click(useTextButton2);
    });

    expect(textarea.value).toEqual(defaultTexts[0].templates[1].text);
  });

  it('should alert on presence of specific characters', () => {
    global.alert = jest.fn();

    const { container, getByTestId } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    expect(global.alert).not.toHaveBeenCalled();

    const textarea = container.querySelector('textarea');

    act(() => {
      fireEvent.change(textarea, { target: { value: '{{ replace_me }}' } });
    });

    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    expect(global.alert).toHaveBeenCalled();

    global.alert.mockRestore();
  });

  it('should handle submit', () => {
    const { getByTestId } = render(
      withAppContext(
        <StatusForm
          incident={incidentFixture}
          defaultTexts={defaultTexts}
          onClose={onClose}
          onPatchIncident={onPatchIncident}
        />
      )
    );

    expect(onClose).not.toHaveBeenCalled();
    expect(onPatchIncident).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId('statusFormSubmitButton'));
    });

    expect(onPatchIncident).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('', () => {});
});
