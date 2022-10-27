import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith-es/react';
import flagsmith from 'flagsmith-es/isomorphic';
import { IState } from 'flagsmith-es/types';

const environmentID = "QjgYur4LQTwe5HpvbvhpzK"

function MyApp({ Component, pageProps, flagsmithState }: AppProps & {flagsmithState: IState}) {
    return (
        <FlagsmithProvider flagsmith={flagsmith}
                           options={{
                               environmentID,
                               enableLogs: true,
                               cacheFlags: true,
                               cacheOptions: {skipAPI:true,ttl:5000}
                           }}
                           serverState={flagsmithState as IState}
>
            <Component {...pageProps} />
        </FlagsmithProvider>
    );
}


MyApp.getInitialProps = async () => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  await flagsmith.init({ // fetches flags on the server
      environmentID,
  });
  return { flagsmithState: flagsmith.getState() }
}

export default MyApp;
