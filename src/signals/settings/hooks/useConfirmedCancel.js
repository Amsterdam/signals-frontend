import { useHistory } from 'react-router-dom';

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
  const redirect = isPristine => {
    if (
      isPristine ||
      (!isPristine &&
        global.confirm('Niet opgeslagen gegevens gaan verloren. Doorgaan?'))
    ) {
      history.push(redirectURL);
    }
  };

  return redirect;
};

export default useConfirmedCancel;
