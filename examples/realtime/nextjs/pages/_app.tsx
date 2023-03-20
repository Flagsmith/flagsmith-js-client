import type { AppProps } from 'next/app';
import { FlagsmithProvider } from 'flagsmith-es/react';
import flagsmith from 'flagsmith-es/isomorphic';
import { IState } from 'flagsmith-es/types';
import React from 'react';
const environmentID = "AbXqsQqLLAzmfj5SGCm8Ng"

const options = {
    api: "https://edge.bullet-train-staging.win/api/v1/",
    environmentID,
    enableLogs: true,
    realtime: true,
    eventSourceUrl: "https://realtime-staging.flagsmith.com/",
}

function MyApp({ Component, pageProps, flagsmithState }: AppProps & {flagsmithState: IState}) {
    console.log(flagsmithState)
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
    await flagsmith.init(options);


    return { flagsmithState: flagsmith.getState() }
}

export default MyApp;
