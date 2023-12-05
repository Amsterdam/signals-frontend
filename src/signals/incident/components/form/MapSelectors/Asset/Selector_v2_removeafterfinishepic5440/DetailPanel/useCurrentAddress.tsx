// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useRef, useState } from 'react'

import type { Address } from '../../../../../../../../types/address'

type Props = {
  address: Address | undefined
  addressLoading: boolean
}

export const useCurrentAddress = ({ address, addressLoading }: Props) => {
  const newAddressRef = useRef<Address | undefined>(address)
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(
    undefined
  )
  const prevAddressLoading = useRef<boolean | undefined>(undefined)
  useEffect(() => {
    newAddressRef.current = address

    const timeoutId = setTimeout(() => {
      setCurrentAddress(newAddressRef.current)
      prevAddressLoading.current = addressLoading
    }, 100)

    if (!addressLoading && prevAddressLoading.current) {
      setCurrentAddress(newAddressRef.current)
      clearTimeout(timeoutId)
      prevAddressLoading.current = addressLoading
      return
    }

    prevAddressLoading.current = addressLoading

    return () => {
      clearTimeout(timeoutId)
    }
  }, [address, addressLoading])

  return currentAddress
}
