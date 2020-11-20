import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import childIncidentsFixture from 'utils/__tests__/fixtures/childIncidents.json';
import { subcategoriesHandlingTimes } from 'utils/__tests__/fixtures';

import ChildIncidents from '..';
import IncidentDetailContext from '../../../context';

const update = jest.fn();

const renderWithContext = Component =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ handlingTimesBySlug: subcategoriesHandlingTimes, update }}>
      {Component}
    </IncidentDetailContext.Provider>
  );

describe('IncidentDetail/components/ChildIncidents', () => {
  beforeEach(() => {
    update.mockReset();
  });

  it('should not render anything', () => {
    const childIncidents = [];
    const parent = { updated_at: null };
    const { queryByText, queryByTestId } = render(withAppContext(
      <ChildIncidents incidents={childIncidents} parent={parent} />)
    );

    expect(queryByText('Deelmelding')).not.toBeInTheDocument();
    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();
    expect(queryByTestId('noActionButton')).not.toBeInTheDocument();
  });

  it('should render correctly', () => {
    const childIncidents = childIncidentsFixture.results;
    const parent = { updated_at: childIncidentsFixture.results[0].updated_at };

    const { queryByText, queryByTestId, rerender } = render(renderWithContext(
      <ChildIncidents incidents={childIncidents} parent={parent} />
    ));

    expect(queryByText('Deelmelding')).toBeInTheDocument();
    expect(queryByTestId('childIncidents')).toBeInTheDocument();
    expect(queryByTestId('noActionButton')).toBeInTheDocument();

    const updatedParent = { updated_at: new Date().toISOString() };
    rerender(renderWithContext(<ChildIncidents incidents={childIncidents} parent={updatedParent} />));

    expect(queryByText('Deelmelding')).toBeInTheDocument();
    expect(queryByTestId('childIncidents')).toBeInTheDocument();
    expect(queryByTestId('noActionButton')).not.toBeInTheDocument();
  });

  it('should reset the incident state ', async () => {
    const childIncidents = childIncidentsFixture.results;
    const parent = { updated_at: childIncidentsFixture.results[0].updated_at };

    const { findByTestId } = render(withAppContext(renderWithContext(
      <ChildIncidents incidents={childIncidents} parent={parent} />
    )));

    const button = await findByTestId('noActionButton');
    fireEvent.click(button);
    await findByTestId('noActionButton');
    expect(update).toHaveBeenCalledTimes(1);
  });
});
