import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  // @ts-ignore
} from 'react'
import {
  FlagsmithContext,
} from './FlagsmithProvider'
// @ts-ignore
import { IFlagsmith, ITraits, IFlagsmithFeature, IFlagsmithTrait } from '../'
import events from './util/events'

const useConstant = function <T>(value: T): T {
  const ref = useRef(value)
  if (!ref.current) {
    ref.current = value
  }
  return ref.current
}




const flagsAsArray = (_flags: any): string[] => {
  if (typeof _flags === 'string') {
    return [_flags]
  } else if (typeof _flags === 'object') {
    // eslint-disable-next-line no-prototype-builtins
    if (_flags.hasOwnProperty('length')) {
      return _flags
    }
  }
  throw new Error(
    'Flagsmith: please supply an array of strings or a single string of flag keys to useFlags',
  )
}
const getRenderKey = (flagsmith: IFlagsmith, flags: string[], traits: string[] = []) => {
  return flags
    .map((k) => {
      return `${flagsmith.getValue(k)}${flagsmith.hasFeature(k)}`
    }).concat(traits.map((t)=>(
        `${flagsmith.getTrait(t)}`
      )))
    .join(',')
}
function useFlags<F extends string, T extends string>(_flags: readonly F[], _traits?: readonly T[]): {
  [K in F]: IFlagsmithFeature
} & {
  [K in T]: IFlagsmithTrait
} {
  const flags = useConstant<string[]>(flagsAsArray(_flags))
  const traits = useConstant<string[]>(flagsAsArray(_traits))
  const flagsmith = useContext(FlagsmithContext)
  const [renderKey, setRenderKey] = useState<string>(
    getRenderKey(flagsmith, flags),
  )
  const renderRef = useRef<string>(renderKey)
  const eventListener = useCallback(() => {
    const newRenderKey = getRenderKey(flagsmith, flags, traits)
    if (newRenderKey !== renderRef.current) {
      renderRef.current = newRenderKey
      setRenderKey(newRenderKey)
    }
  }, [])
  useEffect(() => {
    events.on('event', eventListener)
    return () => {
      events.off('event', eventListener)
    }
  }, [])
  const res =  useMemo(() => {
    const res: Record<string, IFlagsmithFeature> = {}
    flags.map((k) => {
      res[k] = {
        enabled: flagsmith!.hasFeature(k),
        value: flagsmith!.getValue(k),
      }
    })
    return res
  }, [renderKey])

  return res
}
