
import core  from './flagsmith-core'
import RNEventSource from 'react-native-sse'

export default core({
    browserlessStorage: true,
    // @ts-expect-error - this is due to the library being incorrect
    eventSource: RNEventSource.default
});

export const createFlagsmithInstance = ()=>{
    return core({
        browserlessStorage: true,
        // @ts-expect-error - this is due to the library being incorrect
        eventSource: RNEventSource.default
    })
}
