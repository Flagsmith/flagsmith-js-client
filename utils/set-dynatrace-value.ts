// transforms any trait to match sendSessionProperties
// https://www.dynatrace.com/support/doc/javascriptapi/interfaces/dtrum_types.DtrumApi.html#addActionProperties
import { DynatraceObject } from '../types';
export default function (obj: DynatraceObject, trait: string, value: string|number|boolean|null|undefined) {
    let key: keyof DynatraceObject= 'shortString'
    let convertToString = true
    if (typeof value === 'number') {
        key = 'javaDouble'
        convertToString = false
    }
    // @ts-expect-error
    obj[key] = obj[key] || {}
    // @ts-expect-error
    obj[key][trait] = convertToString ? value+"":value
}
