import { IFlagsmithTrait, IFlagsmithFeature } from 'flagsmith/types';

export default function(flags:Record<string, IFlagsmithFeature | IFlagsmithTrait>) {
    // index renders content based on useFlags, so we mock it
    jest.doMock('flagsmith/react', () => {
        const actualModule = jest.requireActual('flagsmith/react')
        return new Proxy(actualModule, {
            get: (target, property) => {
                switch (property) {
                    case 'useFlags': {
                        return jest.fn().mockReturnValue(flags)
                    }
                    default: {
                        return target[property]
                    }
                }
            },
        })
    })
}
