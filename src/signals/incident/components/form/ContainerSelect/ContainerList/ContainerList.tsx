import React from 'react';
import IconList from 'components/IconList/IconList';
import type { Item } from '../types';

interface ContainerListProps {
  selection: Item[];
  className?: string;
}

const ContainerList: React.FC<ContainerListProps> = ({ selection, className }) =>
  <IconList
    className={className}
    id="containerList"
    items={selection.map(({ id, description, iconUrl }) => ({ iconUrl, label: `${description} - ${id}`, id }))}
  />;

export default ContainerList;
