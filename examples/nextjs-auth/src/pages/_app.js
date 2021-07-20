/* eslint-disable react/jsx-filename-extension, react/jsx-props-no-spreading */
import Auth from 'components/auth';
import { Provider as SessionProvider } from 'next-auth/client';
import { FlagsmithProvider } from 'flagsmith-react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FlagsmithProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_API_KEY}>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </FlagsmithProvider>
  );
}
