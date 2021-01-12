import React from 'react';
import type { Container } from 'shared/types/incident';
import ContainerList from '../../../form/ContainerSelect/ContainerList';

interface ContainerListPreviewProps {
  value: Container[];
}

const ContainerListPreview: React.FC<ContainerListPreviewProps> = ({ value }) => <ContainerList selection={value} />;

export default ContainerListPreview;
