import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith-es/react';
import flagsmith from 'flagsmith-es/isomorphic';
import { IState } from 'flagsmith-es/types';

const environmentID = "AbXqsQqLLAzmfj5SGCm8Ng"

function MyApp({ Component, pageProps, flagsmithState }: AppProps & {flagsmithState: IState}) {
    return (
        <FlagsmithProvider flagsmith={flagsmith}
                           options={{
                               api: 'https://edge.bullet-train-staging.win/api/v1/',
                               environmentID,
                               enableLogs: true,
                               realtime: true,
                           }}
                           serverState={flagsmithState as IState}
>
            <Component {...pageProps} />
        </FlagsmithProvider>
    );
}


MyApp.getInitialProps = async () => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
    if(!flagsmith.initialised) {
        await flagsmith.init({ // fetches flags on the server
            api: 'https://edge.bullet-train-staging.win/api/v1/',
            environmentID,
            enableLogs: true,
            realtime: true,
        });
    }

  return { flagsmithState: flagsmith.getState() }
}

export default MyApp
