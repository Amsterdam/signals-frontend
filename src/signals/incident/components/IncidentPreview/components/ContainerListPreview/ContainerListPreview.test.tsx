import React from 'react';
import { render } from '@testing-library/react';
import type { Container } from 'shared/types/incident';

import ContainerList from '../../../form/ContainerSelect/ContainerList';

import ContainerListPreview from './ContainerListPreview';

jest.mock('../../../form/ContainerSelect/ContainerList', () => jest.fn().mockImplementation(() => null));

describe('ContainerListPreview', () => {
  it('should render ContainerList with props', () => {
    const props: {value: Container[]} = {
      value: [{ id: 'id', type: 'type', description: 'description', iconUrl: 'iconUrl' }],
    };

    render(<ContainerListPreview value={props.value} />);

    expect(ContainerList).toHaveBeenCalledWith({ selection: props.value }, {});
  });
});
