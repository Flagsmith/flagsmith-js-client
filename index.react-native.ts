
import core  from './flagsmith-core'
import RNEventSource from 'react-native-sse'
// @ts-ignore
global.FlagsmithEventSource = RNEventSource.default
import _EventSource from 'reconnecting-eventsource';
export default core({
    browserlessStorage: true,
    // @ts-expect-error - this is due to the library being incorrect
    eventSource: RNEventSource.default
});

export const createFlagsmithInstance = ()=>{
    return core({
        browserlessStorage: true,
        eventSource: _EventSource
    })
}
