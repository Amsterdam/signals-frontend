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
  onToggleCategory: (option: Filter[], select: boolean) => void
  filter: Filter
}

export const FilterCategories = ({ onToggleCategory, filter }: Props) => {
  const [showSubsection, setShowSubsection] = useState<boolean>(true)
  const { name, filterActive, _display, icon, subCategories } = filter

  const showAfvalAndWegenCategories = (name: string) => {
    return name === 'Afval' || name === 'Wegen, verkeer, straatmeubilair'
  }

  return (
    <>
      {showAfvalAndWegenCategories(name) && subCategories ? (
        <SectionWrapper key={`section-${name}`}>
          <WrapperFilterCategoryWithIcon>
            <FilterCategory
              onToggleCategory={(checked: boolean) => {
                onToggleCategory([filter].concat(subCategories), checked)
              }}
              selected={filterActive}
              text={name}
              icon={icon}
            ></FilterCategory>
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
            {subCategories.map((filterSubCategories) => {
              const {
                name: nameChild,
                filterActive: filterActiveChild,
                _display: _displayChild,
                icon: iconChild,
              } = filterSubCategories
              return (
                <FilterCategory
                  onToggleCategory={() => {
                    onToggleCategory(
                      filterActiveChild
                        ? [filterSubCategories]
                        : [filter, filterSubCategories],
                      !filterActiveChild
                    )
                  }}
                  selected={filterActiveChild}
                  text={_displayChild || nameChild}
                  key={nameChild}
                  icon={iconChild}
                />
              )
            })}
          </SubSection>
        </SectionWrapper>
      ) : (
        <FilterCategory
          onToggleCategory={(checked: boolean) => {
            onToggleCategory([filter], checked)
          }}
          selected={filterActive}
          text={_display || name}
          key={name}
          icon={icon}
        ></FilterCategory>
      )}
    </>
  )
}
