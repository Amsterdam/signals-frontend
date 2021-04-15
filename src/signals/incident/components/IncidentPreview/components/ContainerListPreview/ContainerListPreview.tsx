// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react';
import type { FeatureType, Item } from 'signals/incident/components/form/ContainerSelect/types';
import ContainerList from 'signals/incident/components/form/ContainerSelect/ContainerList';

export interface ContainerListPreviewProps {
  value: Item[];
  featureTypes: FeatureType[];
}

const ContainerListPreview: React.FC<ContainerListPreviewProps> = ({ value, featureTypes }) =>
  <ContainerList selection={value} featureTypes={featureTypes} />;
export default ContainerListPreview;
