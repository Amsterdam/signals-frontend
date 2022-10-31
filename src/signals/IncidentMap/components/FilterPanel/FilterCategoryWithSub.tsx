/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { useState } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'

import type { Filter } from '../../types'
import { FilterCategory } from './FilterCategory'
import {
  SectionWrapper,
  WrapperFilterCategoryWithIcon,
  InvisibleButton,
  SubSection,
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
    <>
      <SectionWrapper key={`section-${name}`}>
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

        <SubSection visible={showSubsection} lines={subCategories.length}>
          {subCategories
            .filter((subCategory) => subCategory.nrOfIncidents)
            .map((subCategory) => {
              const { name, filterActive, _display, icon } = subCategory
              return (
                <FilterCategory
                  onToggleCategory={() => {
                    /**
                     * When selecting a sub category when is
                     *  - false, toggle main category true as well
                     *  - true, only toggle sub category
                     */
                    onToggleCategory(subCategory, !filterActive)
                  }}
                  selected={filterActive}
                  text={_display || name}
                  key={name}
                  icon={icon}
                />
              )
            })}
        </SubSection>
      </SectionWrapper>
    </>
  )
}
