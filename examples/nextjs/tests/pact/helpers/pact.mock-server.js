/* eslint no-console: 0 */
const map = require('lodash/map');

const { mock, setup } = require('./pact.server');
const allTests = require('../tests/index.pact');

setup(3001)
    .then(() => {
        map(allTests, (tests) => {
            const { path: testsPath } = tests;
            map(tests, (test, method) => {
                if (typeof test !== 'object') return;
                const { body, requestBody, path: testPath } = test;
                const path = testPath || testsPath;
                console.log('Mocking', path, method);
                mock(path, method, body, requestBody);
            });
        });
    });
