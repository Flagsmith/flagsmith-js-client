import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
class MyApp extends App {
    render() {
        const { Component } = this.props;

        return (
            <Container>
                    <React.Fragment>
                        <Head>
                            <meta charSet="utf-8"/>
                            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
                            <meta name="description" content="The project description"/>
                            <meta name="theme-color" content="#317EFB"/>
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                            <link rel="apple-touch-icon" href="/static/images/icons-192.png"/>
                            <link rel="icon" sizes="192x192" href="/static/images/icons-192.png"/>
                            <link rel="manifest" href="/static/manifest.json"/>
                            <link rel="shortcut icon" href="/static/images/favicon.ico"/>
                            <title>TheProject</title>
                        </Head>
                        <Component />
                    </React.Fragment>
            </Container>
        );
    }
}

export default MyApp;
