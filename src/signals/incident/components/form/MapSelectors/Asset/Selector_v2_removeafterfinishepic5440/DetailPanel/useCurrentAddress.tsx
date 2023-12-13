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

    setCurrentAddress(newAddressRef.current)
    prevAddressLoading.current = addressLoading

    if (!addressLoading && prevAddressLoading.current) {
      setCurrentAddress(newAddressRef.current)
      prevAddressLoading.current = addressLoading
      return
    }

    prevAddressLoading.current = addressLoading
  }, [address, addressLoading])

  return currentAddress
}
