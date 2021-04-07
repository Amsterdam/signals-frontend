// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react';
import { render } from '@testing-library/react';
import ContainerList from 'signals/incident/components/form/ContainerSelect/ContainerList';
import type { FeatureType } from 'signals/incident/components/form/ContainerSelect/types';

import ContainerListPreview from './ContainerListPreview';
import type { ContainerListPreviewProps } from './ContainerListPreview';

jest.mock('signals/incident/components/form/ContainerSelect/ContainerList', () =>
  jest.fn().mockImplementation(() => null)
);

describe('ContainerListPreview', () => {
  it('should render ContainerList with props', () => {
    const props: ContainerListPreviewProps = {
      value: [{ id: 'id', type: 'type', description: 'description' }],
      featureTypes: [
        {
          typeField: 'type',
          typeValue: 'type',
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
