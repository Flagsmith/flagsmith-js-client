/* eslint no-console: 0 */
import fetch from 'isomorphic-unfetch';
import { Pact } from '@pact-foundation/pact';
import path from 'path';
import { consumer, provider } from '../config.pact';
import executeTests from '../helpers/initialise-tests';
import allTests from './index.pact';

global.fetch = fetch;

const { setup: mockServer } = require('../helpers/pact.server');

require('dotenv').config();

executeTests(allTests);

before((done) => {
    global.port = 3213;
    global.api = `http://localhost:${global.port}`;
    global.pact = new Pact({
        port: global.port,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        spec: 2,
        cors: true,
        pactfileWriteMode: 'update',
        consumer,
        provider,
    });
    Promise.all([
        pact.setup(),
        mockServer(global.port),
    ])
        .then(() => done());
});

afterEach((done) => {
    console.log('verifying');
    pact.verify().then(() => done());
});

after((done) => {
    console.log('pact complete');
    pact.finalize().then(() => {
        done();
        process.exit();
    });
});
