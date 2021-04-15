// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
interface IEventDispatcher {
  events: Record<string, (() => void)[]>
  register: (event: string, callback: () => void) => void
  trigger: (event: string) => void
}

type Handlers = (() => void)[]

class EventDispathcher implements IEventDispatcher {
  public events: Record<string, Handlers>

  public constructor() {
    this.events = {}
    this.register = this.register.bind(this)
    this.trigger = this.trigger.bind(this)
  }

  public register = (event: string, handler: () => void) => {
    const handlers: Handlers = this.events[event] || []
    handlers.push(handler)
    this.events[event] = handlers
  }

  public trigger = (event: string) => {
    const handlers: Handlers = this.events[event]

    if (!handlers || handlers.length < 1) return

    ;[].forEach.call(handlers, (handler: () => void) => {
      handler()
    })
  }
}

export default EventDispathcher
