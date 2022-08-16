
import core  from './flagsmith-core'
import RNEventSource from 'react-native-event-source'

export default core({
    eventSource: RNEventSource
});

export const createFlagsmithInstance = ()=>{
    return core({
        eventSource: RNEventSource
    })
}
