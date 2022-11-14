/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { Fragment, useState } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'

import type { Filter } from '../../types'
import { FilterCategory } from './FilterCategory'
import {
  WrapperFilterCategoryWithIcon,
  InvisibleButton,
  SubSection,
  Underlined,
} from './styled'

export interface Props {
  onToggleCategory: (filter: Filter, select: boolean) => void
  filter: Filter
}

export const FilterCategoryWithSub = ({ onToggleCategory, filter }: Props) => {
  const [showSubsection, setShowSubsection] = useState<boolean>(false)
  const { name, filterActive, icon, subCategories } = filter

  if (!subCategories) return null
  return (
    <Fragment key={`section-${name}`}>
      <WrapperFilterCategoryWithIcon>
        <FilterCategory
          onToggleCategory={() => {
            onToggleCategory(filter, !filterActive)
          }}
          selected={filterActive}
          text={name}
          icon={icon}
        />

        <InvisibleButton
          title={`Toon ${showSubsection ? 'minder' : 'meer'} filter opties`}
          aria-expanded={showSubsection}
          toggle={showSubsection}
          onClick={() => setShowSubsection(!showSubsection)}
        >
          <ChevronDown width={20} height={20} />
        </InvisibleButton>
      </WrapperFilterCategoryWithIcon>
      <Underlined />
      <SubSection visible={showSubsection} lines={subCategories.length}>
        {subCategories
          .filter((subCategory) => subCategory.incidentsCount)
          .map((subCategory) => {
            const { name, filterActive, icon } = subCategory
            return (
              <>
                <FilterCategory
                  onToggleCategory={() => {
                    onToggleCategory(subCategory, !filterActive)
                  }}
                  selected={filterActive}
                  text={name}
                  key={name}
                  icon={icon}
                />
                <Underlined />
              </>
            )
          })}
      </SubSection>
    </Fragment>
  )
}
