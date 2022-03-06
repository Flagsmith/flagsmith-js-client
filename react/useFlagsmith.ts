// @ts-ignore
import { useContext } from 'react'
import { FlagsmithContext } from './FlagsmithProvider';
import { IFlagsmith } from '../types'

export const useFlagsmith = () => {
  const context = useContext<IFlagsmith>(FlagsmithContext)

  if (!context) {
    throw new Error('useFlagsmith must be used with in a FlagsmithProvider')
  }

  return context as IFlagsmith
}
