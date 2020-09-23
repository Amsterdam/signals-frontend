/* eslint-disable no-await-in-loop */
import React from 'react';
import { act, fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { withAppContext } from 'test/utils';
// import incident from 'utils/__tests__/fixtures/incident.json';
import * as modelSelectors from 'models/categories/selectors';
import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';

// import { onSubmit } from 'react-hook-form';
import IncidentSplitForm from '../IncidentSplitForm';
import IncidentSplitFormIncident from '../IncidentSplitFormIncident';

const parentIncident = {
  id: 6010,
  status: 'm',
  statusDisplayName: 'Gemeld',
  priority: 'normal',
  subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
  subcategoryDisplayName: 'STW',
  description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
  type: 'SIG',
};

// const parentIncident =

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}));

const subCategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  // mapping subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
  .map(subCat => ({ ...subCat, key: subCat._links.self.href }));

describe('<IncidentSplitForm />', () => {
  let props;
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.spyOn(modelSelectors, 'makeSelectSubCategories').mockImplementation(() => subCategories);

    props = {
      parentIncident,
      // subcategories: [{ key: 'poep', value: 'Poep', slug: 'poep' }],
      onSubmit,
    };
  });

  it('should render correctly', () => {
    const { queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} />));

    expect(queryAllByText(parentIncident.description)).toHaveLength(1);
  });

  it('should split into 2 more incidents', () => {
    const { getByTestId, queryAllByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

    act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });
    expect(queryAllByTestId('splittedIncidentTitle')[1]).toHaveTextContent(/^Deelmelding 2$/);

    act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });
    expect(queryAllByTestId('splittedIncidentTitle')[2]).toHaveTextContent(/^Deelmelding 3$/);
  });

  // it('should disable submit button when clicked', () => {
  //   const { debug, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));
  //   const incidentSplitFormSubmitButton = getByTestId('incidentSplitFormSubmitButton');

  //   expect(incidentSplitFormSubmitButton.disabled).toEqual(false);

  //   act(() => { fireEvent.click(getByTestId('incidentSplitFormSubmitButton')); });
  //   expect(incidentSplitFormSubmitButton.disabled).toEqual(true);
  // });

  it('should handle submit', async () => {
    const { getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

    act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });

    await act(async () => { fireEvent.submit(getByTestId('incidentSplitFormSubmitButton')); });

    expect(onSubmit).toHaveBeenCalledWith({
      department: 'null',
      issues: [
        undefined,
        {
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
        {
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
      ],
    });
  });

  it('should hide incident split button when split limit reached', async () => {
    const { debug, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

    const splitLimit = IncidentSplitFormIncident.defaultProps.splitLimit;

    console.log(splitLimit);
    debug(screen.getByRole('button'));

    for (const _value of Array(splitLimit - 1)) { // eslint-disable-line no-unused-vars
      act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });
      expect(getByTestId('incidentSplitFormSubmitButton')).toBeInTheDocument();
    }

    debug(getByTestId('incidentSplitFormSubmitButton'));

    await act(async () => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });

    // const submitButton = screen.queryAllByText('submit');
    // expect(submitButton).toBeNull();

    // fireEvent.click(getByTestId('incidentSplitFormSplitButton'));

    // await waitForElementToBeRemoved(() => getByTestId('incidentSplitFormSubmitButton'));
    // await waitFor(() =>

    // );
    // await waitFor(() => expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined());
    // await waitFor(() => expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined());
    // await waitFor(() => expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined());

    // // expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined();

    // await act(async () => {
    //   await waitFor(() => expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined());
    // });

    // await waitFor(() => expect(getByTestId('incidentSplitFormSubmitButton')).toBeDefined());

    // await waitForElementToBeRemoved(() => queryByText('the mummy'));

    // expect(getByTestId('incidentSplitFormSubmitButton')).toBeInTheDocument();
    // expect(getByTestId('incidentSplitFormSubmitButton')).toBeInTheDocument();

    // Array(splitLimit - 1).fill().forEach(() => {
    //   act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });
    //   expect(getByTestId('incidentSplitFormSubmitButton')).toBeInTheDocument();
    // });

    // act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });

    // act(() => { fireEvent.click(getByTestId('incidentSplitFormSplitButton')); });
    // expect(getByTestId('incidentSplitFormSubmitButton')).not.toBeInTheDocument();

    // await act(async () => { fireEvent.submit(getByTestId('incidentSplitFormSubmitButton')); });

    // expect(onSubmit).toHaveBeenCalledWith({
    //   department: 'null',
    //   issues: [
    //     undefined,
    //     {
    //       description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
    //       priority: 'normal',
    //       type: 'SIG',
    //     },
    //     {
    //       description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
    //       priority: 'normal',
    //       type: 'SIG',
    //     },
    //   ],
    // });
  });

  // it('should handle cancel', () => {
  //   const { getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

  //   act(() => { fireEvent.click(getByTestId('splitFormCancel')); });
  //   expect(props.onHandleCancel).toHaveBeenCalled();
  // });

  // it('should handle empty incidents', () => {
  //   const { getByTestId, queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} incident={null} />));

  //   expect(queryAllByText(incident.text)).toHaveLength(0);

  //   act(() => { fireEvent.click(getByTestId('incidentSplitFormSubmitButton')); });
  //   expect(props.onSubmit).not.toHaveBeenCalled();
  // });
});
