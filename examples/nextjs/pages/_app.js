import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';

import { Provider } from 'react-redux';
import bulletTrain from 'bullet-train-client/isomorphic';
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
            var environmentID = 'uCDQzKWgejrutqSYYsKWen'
            await bulletTrain.init({
                environmentID: environmentID,
                defaultFlags: {
                    font_size: 10
                },
                onChange: function () {
                    console.log("CHANGED")
                }
            });

            await Promise.all([
                ctx.store.dispatch(AppActions.startup({ serverLoaded:true, config: bulletTrain.getState() })),
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
            bulletTrain.setState(this.props.store.getState().config);
            bulletTrain.onChange = ()=> {
                this.props.store.dispatch(AppActions.startup({ serverLoaded:true, config:bulletTrain.getState() }));
            }
            this.props.store.dispatch(AppActions.startup({ clientLoaded:true })); // Post startup action with token and locale
        }
    }


    render() {
        const { Component, pageProps, store } = this.props;
        return (
            <Container>
                <Provider store={store}>
                    <React.Fragment>
                        <Head>
                            <title>The Project</title>
                        </Head>
                        <Component {...pageProps} />
                    </React.Fragment>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(createStore)(withReduxSaga(MyApp));
