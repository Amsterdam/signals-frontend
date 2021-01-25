import React from 'react';
import type { FeatureType, Item } from 'signals/incident/components/form/ContainerSelect/types';
import ContainerList from '../../../form/ContainerSelect/components/ContainerList';

interface ContainerListPreviewProps {
  value: Item[];
  featureTypes: FeatureType[];
}

const ContainerListPreview: React.FC<ContainerListPreviewProps> = ({ value, featureTypes }) => (
  <ContainerList selection={value} featureTypes={featureTypes} />
);

export default ContainerListPreview;
