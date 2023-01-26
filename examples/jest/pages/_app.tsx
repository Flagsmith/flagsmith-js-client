import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';
import { IState } from 'flagsmith/types';
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
  // calls page's `getInitialProps` and fills `appProps.pageProps`
    if(!flagsmith.initialised){
        await flagsmith.init({ // fetches flags on the server
            environmentID,
        });
    }
  return { flagsmithState: flagsmith.getState() }
}

export default MyApp;
