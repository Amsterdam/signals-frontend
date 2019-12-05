import { useRef, useState, useCallback } from 'react';

const useValidation = (formRef, validationClassName = 'invalid') => {
  const errorsRef = useRef({});
  const [event, setEvent] = useState();
  const [isValid, setIsValid] = useState();
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    e => {
      const { elements } = formRef.current;

      if (formRef.current.noValidate) {
        // prevent the form from being submit when the noValidate attribute has been set
        // when noValidate has not been set, the form won't submit because of HTML5 validation
        // taking over
        e.preventDefault();
      }

      [...elements]
        .forEach(element => {
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

            element.parentElement.classList.remove(validationClassName);
          } else {
            let error;

            if (required && validity.valueMissing) {
              error = 'Dit veld is verplicht';
            }

            if (validity.typeMismatch) {
              switch (element.type) {
                case 'email':
                  error = 'Het veld moet een geldig e-mailadres bevatten';
                  break;
                case 'date':
                  error = 'Het veld moet een geldige datum bevatten';
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

            element.parentElement.classList.add(validationClassName);
          }
        });

      const hasErrors =
        Object.values(errorsRef.current).filter(Boolean).length > 0;

      setIsValid(!hasErrors);
      setEvent(e);
    },
    [formRef, validationClassName]
  );

  return { validate, isValid, errors, event };
};

export default useValidation;
