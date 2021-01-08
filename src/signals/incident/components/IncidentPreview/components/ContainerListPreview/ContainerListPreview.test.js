import React from 'react';
import { render, screen } from '@testing-library/react';

import ContainerList from '../../../form/ContainerSelect/ContainerList';

import ContainerListPreview from './ContainerListPreview';

jest.mock('../../../form/ContainerSelect/ContainerList', () => jest.fn().mockImplementation(() => null));

describe('ContainerListPreview', () => {
  it('should render ContainerList with props', () => {
    const props = {
      value: [{ id: 'id', description: 'description', iconUrl: 'iconUrl' }],
    };

    render(<ContainerListPreview value={props.value} />);

    expect(ContainerList).toHaveBeenCalledWith({ selection: props.value }, {});
  });
});
