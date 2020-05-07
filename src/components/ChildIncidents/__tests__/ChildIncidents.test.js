import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';

import { withAppContext } from 'test/utils';

import { INCIDENT_URL } from 'signals/incident-management/routes';
import { statusList } from 'signals/incident-management/definitions';
import categories from 'utils/__tests__/fixtures/categories.json';
import departments from 'utils/__tests__/fixtures/departments.json';
import incident from 'utils/__tests__/fixtures/incident.json';

import ChildIncidents, { STATUS_RESPONSE_REQUIRED, STATUS_NONE } from '..';

const randomElement = array => array[Math.floor(Math.random() * array.length)];

const getChildren = (opts = {}) => {
  const options = { ...{ numValues: 4, withHref: true, withStatus: true }, ...opts };

  return incident._links['sia:children'].map(({ href }) => {
    const id = href.substring(href.lastIndexOf('/') + 1, href.length);
    const values = {
      id,
      status: options.numValues > 1 && randomElement(statusList).value,
      categorie: options.numValues > 2 && randomElement(categories.sub).value,
      afdeling: options.numValues > 3 && randomElement(departments.results).code,
    };

    return {
      href: options.withHref ? `${INCIDENT_URL}/${id}` : undefined,
      status: options.withStatus ? STATUS_RESPONSE_REQUIRED : STATUS_NONE,
      values,
    };
  });
};

describe('components/ChildIncidents', () => {
  it('should render a list', () => {
    const children = getChildren();
    const { getByTestId } = render(withAppContext(<ChildIncidents incidents={children} />));

    const list = getByTestId('childIncidents');

    expect(list).toBeInTheDocument();
    expect(list.nodeName).toEqual('UL');
    expect(document.querySelectorAll('li')).toHaveLength(children.length);
  });

  it('should render links', () => {
    const children = getChildren();
    const { container, rerender } = render(withAppContext(<ChildIncidents incidents={children} />));

    expect(container.querySelectorAll('a').length).toBeGreaterThan(0);

    rerender(withAppContext(<ChildIncidents incidents={getChildren({ withHref: false })} />));

    expect(container.querySelectorAll('a').length).toEqual(0);
  });

  it('should show a status incidator', () => {
    const children = getChildren();
    const { container, rerender } = render(withAppContext(<ChildIncidents incidents={children} />));

    container.querySelectorAll('li').forEach(element => {
      expect(element).toHaveStyleRule('border-right', '2px solid white', {
        modifier: '::before',
      });
    });

    rerender(withAppContext(<ChildIncidents incidents={getChildren({ withStatus: false })} />));

    container.querySelectorAll('li').forEach(element => {
      expect(element).not.toHaveStyleRule('border-right', '2px solid white', {
        modifier: '::before',
      });
    });
  });

  it('should wrap contents', () => {});

  it('should set the flex basis for all but the first and last element', () => {});

  it('should set the max width for the fourth element', () => {});
});
