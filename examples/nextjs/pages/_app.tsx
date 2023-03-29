import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith-es/react';
import flagsmith from 'flagsmith-es/isomorphic';
import { IInitConfig, IState } from 'flagsmith-es/types';
const environmentID = 'QjgYur4LQTwe5HpvbvhpzK'

const options:IInitConfig = {
    environmentID,
    cacheFlags: true
}

function MyApp({ Component, pageProps, flagsmithState }: AppProps & {flagsmithState: IState}) {
    return (
        <FlagsmithProvider flagsmith={flagsmith}
                           options={options}
                           serverState={flagsmithState as IState}
>
            <Component {...pageProps} />
        </FlagsmithProvider>
    );
}


MyApp.getInitialProps = async () => {
    if(!flagsmith.initialised) {
        // Initialise flagsmith if it hasn't been already in memory.
        await flagsmith.init(options);
    }

  return { flagsmithState: flagsmith.getState() }
}

export default MyApp;
