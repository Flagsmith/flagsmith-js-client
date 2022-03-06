// @ts-ignore
import React, { createContext, FC, useEffect, useState } from 'react'
import { IFlagsmith, IState } from '../types'
import events from './util/events'

export const FlagsmithContext = createContext<IFlagsmith | null>(null)
export type FlagsmithContextType = {
  flagsmith: IFlagsmith
  serverState?: IState
  options: Parameters<IFlagsmith['init']>[0]
}

export const FlagsmithProvider: FC<FlagsmithContextType> = ({
  flagsmith,
  options,
  serverState,
  children,
}) => {
  // @ts-ignore
  if (serverState && !flagsmith.api) {
    // @ts-ignore
    flagsmith.setState(serverState)
  }
  useEffect(() => {

    flagsmith.init({
      ...options,
      onChange: (...args) => {
        if (options.onChange) {
          options.onChange(...args)
        }
        events.trigger('event')
      },
    })
    // eslint-disable-next-line
  }, [])
  return (
    <FlagsmithContext.Provider value={flagsmith}>
      {children}
    </FlagsmithContext.Provider>
  )
}

export default FlagsmithProvider
