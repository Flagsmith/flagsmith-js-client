import React, {
    createContext, FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    // @ts-ignore
} from 'react'

function Eventjs(){"use strict";var e={};var r=this;for(var t=0;t<arguments.length;t++){var n=arguments[t];switch(typeof n){case"string":e[n]=[];break;case"object":r=n;break;default:throw new TypeError("Eventjs() only accepts string and object parameters");break}}if(r===this&&!(this instanceof Eventjs)){throw new ReferenceError('Eventjs is not called with "new" keyword and no parameter of type object is passed to it')}function s(r){"use strict";if(typeof r!=="string"||!e[r]){throw new ReferenceError("The event name does not exist in this event manager: "+r)}return true}r.on=function(r){"use strict";s(r);for(var t=1;t<arguments.length;t++){var n=arguments[t];if(e[r].indexOf(n)===-1){e[r].push(n)}}return this};r.off=function(t){"use strict";switch(arguments.length){case 0:for(var n in e){if(e.hasOwnProperty(n)){r.off(n)}}break;case 1:s(t);e[t].length=0;break;default:s(t);for(var a=1;a<arguments.length;a++){var i=arguments[a];var o=e[t].indexOf(i);if(o!==-1){e[t].splice(o,1)}}break}return this};r.trigger=function(t){"use strict";s(t);var n=[];for(var a=1;a<arguments.length;a++){n.push(arguments[a])}var i=e[t];var o=[];for(var f=0;f<i.length;f++){var u=i[f];try{u.apply(r,n)}catch(c){o.push({listener:u,error:c})}}if(o.length>0){throw o}return this};return r}
// @ts-ignore
const events = new Eventjs( 'event' );

// @ts-ignore
import {IFlagsmith, IFlagsmithTrait, IFlagsmithFeature, IState} from '../types'

export const FlagsmithContext = createContext<IFlagsmith | null>(null)
export type FlagsmithContextType = {
    flagsmith: IFlagsmith
    serverState?: IState
    options: Parameters<IFlagsmith['init']>[0]
}

export const FlagsmithProvider: FC<FlagsmithContextType> = ({
 flagsmith, options, serverState, children,
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
        }).concat(traits.map((t) => (
            `${flagsmith.getTrait(t)}`
        )))
        .join(',')
}

export function useFlags<F extends string, T extends string>(_flags: readonly F[], _traits: readonly T[] = []): {
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
    const res = useMemo(() => {
        const res: any = {}
        flags.map((k) => {
            res[k] = {
                enabled: flagsmith!.hasFeature(k),
                value: flagsmith!.getValue(k),
            }
        }).concat(traits?.map((v) => {
            res[v] = flagsmith.getTrait(v)
        }))
        return res
    }, [renderKey])

    return res
}

export const useFlagsmith = () => {
    const context = useContext<IFlagsmith>(FlagsmithContext)

    if (!context) {
        throw new Error('useFlagsmith must be used with in a FlagsmithProvider')
    }

    return context as IFlagsmith
}
