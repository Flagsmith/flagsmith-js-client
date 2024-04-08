import { IFlags, ITraits } from '../types';
import deepEqual from 'fast-deep-equal';

export default function(before: ITraits | IFlags | undefined | null, after:ITraits | IFlags | undefined | null) {
    const changedValues = Object.keys(after||{}).filter((flagKey)=>{
        const beforeValue = before?.[flagKey]
        const afterValue = after?.[flagKey]
        return !deepEqual(beforeValue, afterValue)
    })
    Object.keys(before||{}).filter((flagKey)=>{
        if(!Object.keys(after||{}).includes(flagKey)) {
            changedValues.push(flagKey)
        }
    })
    if (!Object.keys(changedValues).length) {
        return null
    }
    return changedValues
}
