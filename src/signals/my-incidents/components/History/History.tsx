/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import {useEffect} from "react";

import useFetch from "../../../../hooks/useFetch";
import useLocationReferrer from "../../../../hooks/useLocationReferrer";
import configuration from "../../../../shared/services/configuration/configuration";
import type {MyIncident} from "../../types";
import {StatusBlock, Wrapper, Status, StatusStat, StyledH4} from './styled'
import {FormTitle} from "../../pages/styled";

const defaultData = [
  {
    "when": "2022-11-16T12:00:00+00:00",
    "what": "UPDATE_LOCATION",
    "action": "Locatie gewijzigd naar:",
    "description": "Locatie is gepinned op kaart",
    "_signal": "00000000-0000-0000-0000-000000000000"
  }
]

export const History = () => {
  const {get, data = defaultData, error} = useFetch<MyIncident>()
  const location = useLocationReferrer() as Location
  // const { incidentsDetail, setIncidentsDetail } = useMyIncidents()
  // const incidentDisplay = useRef<string>()

  // useEffect(() => {
  //   data && setIncidentsDetail(data)
  //   incidentDisplay.current = data?._display
  // }, [data, setIncidentsDetail])

  useEffect(() => {
    const locationPathArray = location.pathname.split('/')
    const token = locationPathArray[locationPathArray.length - 2]
    const uuid = locationPathArray[locationPathArray.length - 1]
    get(
      `${configuration.MY_SIGNALS_ENDPOINT}/${uuid}/history`,
      {},
      {Authorization: `Token ${token}`}
    )
  }, [get, location.pathname])

  console.log('Dit si de data: ', data)
  console.log('Dit is de error: ', error);
  return (
    <>
      <Wrapper>
        <StatusBlock>
          <Status>Status</Status>
          <StatusStat>insert iets van data</StatusStat>
        </StatusBlock>

        <StyledH4 forwardedAs="h2">Geschiedenis</StyledH4>
        <FormTitle>insert date when</FormTitle>
        <p>insert action : </p>
      </Wrapper>
    </>
  )
}
