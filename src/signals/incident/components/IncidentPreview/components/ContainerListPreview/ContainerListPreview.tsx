import React from 'react';
import type { Item } from 'signals/incident/components/form/ContainerSelect/types';
import ContainerList from '../../../form/ContainerSelect/components/ContainerList';

interface ContainerListPreviewProps {
  value: Item[];
}

const ContainerListPreview: React.FC<ContainerListPreviewProps> = ({ value }) => <ContainerList selection={value} />;

export default ContainerListPreview;
