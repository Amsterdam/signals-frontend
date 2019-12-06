import { useRef, useState, useCallback } from 'react';

/**
 * useFormValidation hook
 *
 * When called, will go through all form elements and look up those that have their `required` attribute
 * set. For all those fields, the value of their `type` attribute determines which error message is
 * returned
 *
 * @param {HTMLFormElement} formRef - Reference to the form node of which the fields should be validated
 * @param {String} invalidFieldClassName - Class name that is added to the form field's parent when invalid
 */
const useFormValidation = (formRef, invalidFieldClassName) => {
  // Use a ref to internally keep track of which errors have been set; useState is asynchronous and will not
  // have the set of values at the time it is needed in this hook
  const errorsRef = useRef({});
  const [event, setEvent] = useState();
  const [isValid, setIsValid] = useState();
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    e => {
      const { elements } = formRef.current;

      if (formRef.current.noValidate) {
        // Prevent the form from being submitted when the noValidate attribute has been set on the form
        // When noValidate has not been set, the form won't submit because of HTML5 validation taking over
        e.preventDefault();
      }

      [...elements].forEach(element => {
        const { name, validity, required } = element;

        if (validity.valid) {
          errorsRef.current = {
            ...errorsRef.current,
            [name]: undefined,
          };

          setErrors(state => ({
            ...state,
            [name]: undefined,
          }));

          if (invalidFieldClassName !== undefined) {
            element.parentElement.classList.remove(invalidFieldClassName);
          }
        } else {
          let error;

          if (required && validity.valueMissing) {
            error = 'Dit veld is verplicht';
          }

          if (validity.typeMismatch || validity.patternMismatch) {
            switch (element.type) {
              case 'email':
                error = 'Het veld moet een geldig e-mailadres bevatten';
                break;
              case 'date':
                error = 'Het veld moet een geldige datumnotatie bevatten';
                break;
              case 'number':
                error = 'Het veld mag alleen nummers bevatten';
                break;
              case 'tel':
                error = 'Het veld moet een geldig telefoonnummer bevatten';
                break;
              case 'time':
                error = 'Het veld moet een geldige tijdnotatie bevatten';
                break;
              case 'url':
                error = 'Het veld moet een geldig url bevatten';
                break;
              default:
                error = 'De waarde van het veld voldoet niet';
                break;
            }
          }

          errorsRef.current = {
            ...errorsRef.current,
            [name]: error,
          };

          setErrors(state => ({
            ...state,
            [name]: error,
          }));

          if (invalidFieldClassName !== undefined) {
            element.parentElement.classList.add(invalidFieldClassName);
          }
        }
      });

      const hasErrors =
        Object.values(errorsRef.current).filter(Boolean).length > 0;

      setIsValid(!hasErrors);
      setEvent(e);
    },
    [formRef, invalidFieldClassName]
  );

  /**
   * @typedef {Object}
   * @property {Function} validate - Main validation function; takes a form's submit event as parameter
   * @property {Boolean} isValid - Indicator of validity of all fields in the form
   * @property {Object} errors - Key/value pairs of field names and error messages
   * @property {Event} event - The initial form submission event
   */
  return { validate, isValid, errors, event };
};

export default useFormValidation;
