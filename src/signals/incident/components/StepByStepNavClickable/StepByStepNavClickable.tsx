// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import type { HTMLAttributes } from 'react'
import { useCallback, useContext, useEffect, useRef } from 'react'

import type { StepByStepNavProps } from '@amsterdam/asc-ui/lib/components/StepByStepNav/StepByStepNavStyle'
import StepByStepNavStyle, {
  OrderdedList,
  transitionBreakpoint,
} from '@amsterdam/asc-ui/lib/components/StepByStepNav/StepByStepNavStyle'
import { useFormContext } from 'react-hook-form'

import { StyledLabel, StyledListItem } from './styled'
import { WizardContext } from '../StepWizard'

type Props = StepByStepNavProps &
  HTMLAttributes<HTMLElement> & { wizardRoutes: string[]; activeItem: number }

export function StepByStepNavClickable({
  activeItem,
  className,
  breakpoint,
  wizardRoutes,
  ...props
}: Props) {
  const { navigate, stepsCompletedCount, setStepsCompletedCount } =
    useContext(WizardContext)
  const { trigger, watch, formState } = useFormContext()

  const prevChangedField = useRef<string>()

  const onListClickHandler = useCallback(
    async (newIndex) => {
      if (newIndex > stepsCompletedCount) {
        return
      }

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
        navigate(`incident/${wizardRoutes[newIndex]}`)
      }

      /**
       * For steps higher than activeItem check validity. If its not valid,
       * change stepsCompletedCount to the current one. This is to force the user
       * to fix the faulty steps first before continuing.
       */
      if (newIndex > activeItem && newIndex <= stepsCompletedCount) {
        if (isValid) {
          navigate(`incident/${wizardRoutes[newIndex]}`)
        } else {
          setStepsCompletedCount(activeItem)
        }
      }
    },
    [
      activeItem,
      navigate,
      setStepsCompletedCount,
      stepsCompletedCount,
      trigger,
      wizardRoutes,
    ]
  )

  useEffect(() => {
    /**
     * The watch of react hook form will fire first. Then the useEffect body
     * will. That's the moment that we are certain there is an error in this step
     * and we need to reset stepsCompletedCount. The formState errors alone is not a
     * good indicator. formState errors will have an error for a splitsecond,
     * cause its state is not changing in par with the wizard's state.
     */
    if (
      prevChangedField.current &&
      Object.keys(formState.errors).includes(prevChangedField.current)
    ) {
      setStepsCompletedCount(activeItem)
    }

    /**
     * A new category prediction is being requested on change. Therefore
     * when changing the description field, reset stepsCompletedCount.
     */
    const subscription = watch((_, { name, type }) => {
      if (name === 'description' && type === 'change') {
        setStepsCompletedCount(activeItem)
      } else {
        prevChangedField.current = name
      }
    })
    return () => subscription.unsubscribe()
  }, [setStepsCompletedCount, watch, formState, activeItem])

  return (
    <StepByStepNavStyle
      activeItem={stepsCompletedCount}
      aria-label="progress"
      className={className}
      role="group"
      {...props}
    >
      <OrderdedList breakpoint={breakpoint}>
        {props.steps.map(({ label }, index) => {
          const isActive = index === stepsCompletedCount - 1
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
