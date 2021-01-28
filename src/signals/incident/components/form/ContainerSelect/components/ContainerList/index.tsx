import React from 'react';
import IconList from 'components/IconList/IconList';
import type { FeatureType, Item } from 'signals/incident/components/form/ContainerSelect/types';
import IconListItem from 'components/IconList/IconListItem';

export interface ContainerListProps {
  selection: Item[];
  featureTypes: FeatureType[];
  className?: string;
}

const ContainerList: React.FC<ContainerListProps> = ({ selection, className, featureTypes }) => {
  const selectedItems = selection.map(({ id, type }) => {
    const { description, icon }: Partial<FeatureType> = featureTypes.find(({ typeValue }) => typeValue === type) ?? {};

    return {
      id,
      label: `${description} - ${id}`,
      iconUrl: icon ? `data:image/svg+xml;base64,${btoa(icon.iconSvg)}` : '',
    };
  });

  return (
    <IconList className={className} id="containerList">
      {selectedItems.map(item => (
        <IconListItem key={item.id} data-testid={`containerEditListItem-${item.id}`} iconUrl={item.iconUrl}>
          {item.label}
        </IconListItem>
      ))}
    </IconList>
  );
};

export default ContainerList;
