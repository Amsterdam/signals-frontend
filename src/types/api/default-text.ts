import { StatusCode } from 'signals/incident-management/definitions/statusList'

type DefaultText = {
  state: StatusCode
  templates: {
    text: string
    title: string
  }[]
}

export type DefaultTexts = DefaultText[]
