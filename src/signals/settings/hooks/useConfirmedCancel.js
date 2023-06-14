// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useNavigate } from 'react-router-dom'

export const confirmationMessage =
  'Niet opgeslagen gegevens gaan verloren. Doorgaan?'

/**
 * Custom hook useConfirmedCancel
 *
 * Will take a URL and can be used as onCancel callback for forms
 *
 * @param {String} redirectURL - key/value
 * @returns {Function}
 */
const useConfirmedCancel = (redirectURL) => {
  const navigate = useNavigate()

  /**
   * redirect function
   *
   * @param {Boolean} isPristine - Flag indicating if the form data has changed
   */
  return (isPristine) => {
    if (isPristine || (!isPristine && global.confirm(confirmationMessage))) {
      navigate(redirectURL)
    }
  }
}

export default useConfirmedCancel
