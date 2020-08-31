import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { TYPE_LOCAL, VARIANT_ERROR, VARIANT_SUCCESS } from 'containers/Notification/constants';
import { showGlobalNotification } from 'containers/App/actions';

/**
 * Custom hook useConfirmedCancel
 *
 * Will take a URL and can be used as onCancel callback for forms
 *
 * @param {Object} options
 * @param {String} options.entityName - Name by which the stored/patched data should be labeled (eg. 'Afdeling')
 * @param {Error} options.error - Exception object
 * @param {Boolean} options.isExisting - Flag indicating if notification should mention newly stored data
 * @param {Boolean} options.isLoading - Flag indicating if data is still loading
 * @param {Boolean} options.isSuccess - Flag indicating if data has been stored/patched successfully
 * @param {String} options.redirectURL - URL to which the push should be directed when isSuccess is truthy
 * @returns {void}
 */
const useFetchResponseNotification = ({ entityName, error, isExisting, isLoading, isSuccess, redirectURL }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const showNotification = useCallback(
    (variant, title) =>
      dispatch(
        showGlobalNotification({
          variant,
          title,
          type: TYPE_LOCAL,
        })
      ),
    [dispatch]
  );

  useEffect(() => {
    if (isLoading || !(error || isSuccess)) return;

    let message;
    let variant = VARIANT_SUCCESS;

    if (error) {
      ({ message } = error);
      variant = VARIANT_ERROR;
    }

    if (isSuccess) {
      const entityLabel = entityName || 'Gegevens';
      message = isExisting ? `${entityLabel} bijgewerkt` : `${entityLabel} toegevoegd`;
    }

    showNotification(variant, message);
  }, [entityName, error, isExisting, isLoading, isSuccess, showNotification]);

  useEffect(() => {
    if (isSuccess && redirectURL) {
      history.push(redirectURL);
    }
  }, [history, isSuccess, redirectURL]);
};

export default useFetchResponseNotification;
