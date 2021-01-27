import React from 'react';
import IconList from 'components/IconList/IconList';
import type { FeatureType, Item } from 'signals/incident/components/form/ContainerSelect/types';

export interface ContainerListProps {
  selection: Item[];
  className?: string;
  featureTypes: FeatureType[];
}

const ContainerList: React.FC<ContainerListProps> = ({ selection, className, featureTypes }) => {
  const selectedItems = selection.map(({ id, type }) => {
    const { description, icon }: Partial<FeatureType> =
      featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

    return {
      id,
      label: `${description} - ${id}`,
      iconUrl: icon ? `data:image/svg+xml;base64,${btoa(icon.iconSvg)}` : '',
    };
  });


  return (
    <IconList
      className={className}
      id="containerList"
      items={selectedItems}
    />
  );
};

export default ContainerList;
