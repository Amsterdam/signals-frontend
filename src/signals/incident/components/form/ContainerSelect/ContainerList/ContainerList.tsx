import React from 'react';
import IconList from 'components/IconList/IconList';
import type { Item } from '../types';

export interface ContainerListProps {
  selection: Item[];
  size?: number;
  className?: string;
}

const ContainerList: React.FC<ContainerListProps> = ({ selection, size, className }) =>
  <IconList
    className={className}
    id="containerList"
    size={size}
    items={selection.map(({ id, description, iconUrl }) => ({ iconUrl, label: `${description} - ${id}`, id }))}
  />;

export default ContainerList;
