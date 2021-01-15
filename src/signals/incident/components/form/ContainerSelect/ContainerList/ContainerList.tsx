import React from 'react';
import IconList from 'components/IconList/IconList';
import type { Item } from '../types';

interface ContainerListProps {
  selection: Item[];
}

const ContainerList: React.FC<ContainerListProps> = ({ selection }) =>
  <IconList
    id="containerList"
    size={40}
    items={selection.map(({ id, description, iconUrl }) => ({ iconUrl, label: `${description} - ${id}`, id }))}
  />;

export default ContainerList;
