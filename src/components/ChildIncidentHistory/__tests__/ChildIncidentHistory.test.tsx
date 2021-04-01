import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import history from 'utils/__tests__/fixtures/history.json';

import ChildIncidentHistory from '..';
import userEvent from '@testing-library/user-event';

describe('<ChildIncidentHistory />', () => {
  const NEW_EVENT = history[0].action;
  const OLD_EVENT = history[1].action;

  it('should render incident history', () => {
    render(withAppContext(<ChildIncidentHistory canView history={history} />));

    expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Toon geschiedenis' })).toBeInTheDocument();
  });

  it('should render nothing when history is empty', () => {
    render(withAppContext(<ChildIncidentHistory canView history={[]} />));

    expect(screen.queryByText(NEW_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Toon geschiedenis' })).not.toBeInTheDocument();
  });

  it('should render nothing when history is not provided', () => {
    render(withAppContext(<ChildIncidentHistory canView />));

    expect(screen.queryByText(NEW_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Toon geschiedenis' })).not.toBeInTheDocument();
  });

  it('should not render incident history when user is not permitted', () => {
    render(withAppContext(<ChildIncidentHistory canView={false} history={history} />));

    expect(screen.queryByText(NEW_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /geschiedenis/ })).not.toBeInTheDocument();

    expect(screen.queryByText('Je hebt geen toestemming om meldingen in deze categorie te bekijken')).toBeInTheDocument();
  });

  it('should toggle showing last or all lines of history', () => {
    render(withAppContext(<ChildIncidentHistory canView history={history} />));

    expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('link', { name: 'Toon geschiedenis' }));

    expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).toBeInTheDocument();

    userEvent.click(screen.getByRole('link', { name: 'Verberg geschiedenis' }));

    expect(screen.queryByText(NEW_EVENT)).toBeInTheDocument();
    expect(screen.queryByText(OLD_EVENT)).not.toBeInTheDocument();
  });
});
