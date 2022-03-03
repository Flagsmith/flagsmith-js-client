// @ts-ignore
import { useContext } from 'react'
import { FlagsmithProvider } from './FlagsmithProvider'
import { IFlagsmith } from '../'

export const useFlagsmith = () => {
  const context = useContext(FlagsmithProvider)

  if (!context) {
    throw new Error('useFlagsmith must be used with in a FlagsmithProvider')
  }

  return context as IFlagsmith
}
