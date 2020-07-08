import { useHistory } from 'react-router-dom';

export const confirmationMessage = 'Niet opgeslagen gegevens gaan verloren. Doorgaan?';

/**
 * Custom hook useConfirmedCancel
 *
 * Will take a URL and can be used as onCancel callback for forms
 *
 * @param {String} redirectURL - key/value
 * @returns {Function}
 */
const useConfirmedCancel = redirectURL => {
  const history = useHistory();

  /**
   * redirect function
   *
   * @param {Boolean} isPristine - Flag indicating if the form data has changed
   */
  return isPristine => {
    if (
      isPristine ||
      (!isPristine &&
        global.confirm(confirmationMessage))
    ) {
      history.push(redirectURL);
    }
  };
};

export default useConfirmedCancel;
