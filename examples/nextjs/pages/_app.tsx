import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith-es/react';
import flagsmith from 'flagsmith-es/isomorphic';
import { IState } from 'flagsmith-es/types';

const environmentID = "QjgYur4LQTwe5HpvbvhpzK"

function MyApp({ Component, pageProps, flagsmithState }: AppProps & {flagsmithState: IState}) {
    return (
        <FlagsmithProvider flagsmith={flagsmith}
                           serverState={flagsmithState as IState}
>
            <Component {...pageProps} />
        </FlagsmithProvider>
    );
}


MyApp.getInitialProps = async () => {
    if(!flagsmith.initialised) {
        // Initialise flagsmith if it hasn't been already in memory.
        await flagsmith.init({ // fetches flags on the server
            environmentID,
        });
    }

  return { flagsmithState: flagsmith.getState() }
}

export default MyApp;
