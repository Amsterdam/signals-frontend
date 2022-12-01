// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { HTMLAttributes } from 'react'
import { useCallback, useContext } from 'react'

import type { StepByStepNavProps } from '@amsterdam/asc-ui/lib/components/StepByStepNav/StepByStepNavStyle'
import StepByStepNavStyle, {
  OrderdedList,
  transitionBreakpoint,
} from '@amsterdam/asc-ui/lib/components/StepByStepNav/StepByStepNavStyle'
import { useFormContext } from 'react-hook-form'

import { WizardContext } from '../StepWizard'
import { StyledLabel, StyledListItem } from './styled'

type Props = StepByStepNavProps &
  HTMLAttributes<HTMLElement> & { wizardRoutes: string[] }

export function StepByStepNavClickable({
  activeItem,
  className,
  breakpoint,
  wizardRoutes,
  ...props
}: Props & { activeItem: number }) {
  let realActiveItem = 0
  const { push, stepsCompletedCount, setStepsCompletedCount } =
    useContext(WizardContext)
  const { trigger } = useFormContext()

  const onListClickHandler = useCallback(
    async (newIndex) => {
      const isValid = await trigger()

      /**
       * When going to a lower step, check validity of the current one.
       * When the current step is invalid:
       * Decrease the stepsCompletedCount by new step index +1 to continue
       * the form in a valid or possible invalid step (when going back one step).
       */
      if (newIndex < activeItem) {
        if (!isValid) {
          setStepsCompletedCount(newIndex + 1)
        }
        push(`incident/${wizardRoutes[newIndex]}`)
      }

      /**
       * For steps higher than activeItem check validity. If its not valid,
       * change stepsCompletedCount to the current one. This is to force the user
       * to fix the faulty steps first before continuing.
       */
      if (newIndex > activeItem && newIndex <= stepsCompletedCount) {
        if (isValid) {
          push(`incident/${wizardRoutes[newIndex]}`)
        } else {
          setStepsCompletedCount(activeItem)
        }
      }
    },
    [
      activeItem,
      push,
      setStepsCompletedCount,
      stepsCompletedCount,
      trigger,
      wizardRoutes,
    ]
  )

  realActiveItem = stepsCompletedCount
  return (
    <StepByStepNavStyle
      activeItem={realActiveItem}
      aria-label="progress"
      className={className}
      role="group"
      {...props}
    >
      <OrderdedList breakpoint={breakpoint}>
        {props.steps.map(({ label }, index) => {
          const isActive = index === realActiveItem - 1
          return (
            <StyledListItem
              stepsCompletedCount={stepsCompletedCount}
              index={index}
              activeItem={activeItem + 1}
              aria-current={!stepsCompletedCount && isActive ? 'step' : 'false'}
              breakpoint={breakpoint}
              key={label}
              onClick={() => onListClickHandler(index)}
              {...props}
            >
              <StyledLabel itemType={props.itemType} breakpoint={breakpoint}>
                {label}
              </StyledLabel>
            </StyledListItem>
          )
        })}
      </OrderdedList>
    </StepByStepNavStyle>
  )
}

StepByStepNavClickable.defaultProps = {
  activeItem: 1,
  breakpoint: transitionBreakpoint,
  className: '',
  itemType: 'none',
}

export default StepByStepNavClickable
