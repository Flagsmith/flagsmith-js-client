import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';

import { Provider } from 'react-redux';
import flagsmith from 'flagsmith/isomorphic';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import createStore from '../common/store';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps;
    if (!ctx.pathname || ctx.pathname === '/_error') {
      return;
    }

    if (typeof window === "undefined") {
      var environmentID = 'QjgYur4LQTwe5HpvbvhpzK'
      await flagsmith.init({
        environmentID: environmentID,
        cacheFlags: true,
        enableLogs: true,
        defaultFlags: {
          font_size: 10
        },
        onChange: function () {
          console.log("CHANGED")
        }
      });

      await Promise.all([
        ctx.store.dispatch(AppActions.startup({ serverLoaded:true, config: flagsmith.getState() })),
      ]);
    }


    if (Component.getInitialProps) { // Wait for pages to complete any async getInitialProps
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }

  constructor(props)
  {
    super(props);
    if ((typeof window !== "undefined") && !this.props.store.getState().clientLoaded) {
      flagsmith.setState(this.props.store.getState().config);
      flagsmith.onChange = ()=> {
        this.props.store.dispatch(AppActions.startup({ serverLoaded:true, config:flagsmith.getState() }));
      }
      this.props.store.dispatch(AppActions.startup({ clientLoaded:true })); // Post startup action with token and locale
    }
  }


  render() {
    const { Component, pageProps, store } = this.props;
    return (
          <Provider store={store}>
            <React.Fragment>
              <Head>
                <title>The Project</title>
              </Head>
              <Component {...pageProps} />
            </React.Fragment>
          </Provider>
    );
  }
}

export default withRedux(createStore)(withReduxSaga(MyApp));
