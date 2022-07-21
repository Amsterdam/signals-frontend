import { Controller, useFormContext } from 'react-hook-form'

/**
 * This Component takes the fieldconfig and show all the visible fields.
 * When clicking something that changes the isVisible status of a form element,
 * show or hide it.
 *
 *
 * @param fieldConfig this is the field config based on the wizard-step-<stepvalue>
 * @returns {JSX.Element}
 * @constructor
 */
const IndexRhf = ({ fieldConfig, parent }) => {
  const controls = Object.fromEntries(
    Object.entries(fieldConfig.controls).filter(
      ([key, value]) => value.meta?.isVisible || key === '$field_0'
    )
  )
  const { control, setValue } = useFormContext()
  return (
    <>
      {Object.entries(controls).map(([_, value]) => {
        if (value.render && parent) {
          return (
            /* Hidden input has no name */
            <Controller
              key={_}
              name={value.meta?.name || 'hidden'}
              control={control}
              render={({ field: { value: v } }) => {
                return (
                  <value.render
                    parent={parent}
                    handler={() => ({
                      onChange: (e) => {
                        value.meta && setValue(value.meta.name, e.target.value)
                      },
                      onBlur: (e) => {
                        value.meta && setValue(value.meta.name, e.target.value)
                      },
                      value: v,
                    })}
                    getError={() => {}}
                    meta={value.meta || parent.meta}
                    hasError={() => {}}
                  ></value.render>
                )
              }}
            />
          )
        }
      })}
    </>
  )
}

// Functions to determine if component shouldUpdate

//
// function isEqual(prevProps, nextProps){
//   return allVisibleKeys(prevProps).every(key=>allVisibleKeys(nextProps).includes(key) )
// }
//
// function allVisibleKeys(props) {
//   return Object.entries(props.fieldConfig.controls).filter(([_, value])=> value.meta?.isVisible).map(([key, _])=> key)
// }

export default IndexRhf
