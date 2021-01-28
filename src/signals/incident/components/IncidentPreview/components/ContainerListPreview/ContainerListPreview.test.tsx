import React from 'react';
import { render } from '@testing-library/react';
import ContainerList from '../../../form/ContainerSelect/components/ContainerList';

import type { ContainerList../../../form/ContainerSelect/components/List/ContainerList
import ContainerListPreview from './ContainerListPreview';
import type { FeatureType } from 'signals/incident/components/form/ContainerSelect/types';

jest.mock('signals/incident/components/form/ContainerSelect/components/ContainerList', () =>
  jest.fn().mockImplementation(() => null)
);

describe('ContainerListPreview', () => {
  it('should render ContainerList with props', () => {
    const props: ContainerListPreviewProps = {
      value: [{ id: 'id', type: 'type', description: 'description' }],
      featureTypes: [
        {
          typeField: 'type',
          icon: {
            iconSvg: 'svg',
          },
        } as FeatureType,
      ],
    };

    render(<ContainerListPreview value={props.value} featureTypes={props.featureTypes} />);

    expect(ContainerList).toHaveBeenCalledWith({ selection: props.value, featureTypes: props.featureTypes }, {});
  });
});
