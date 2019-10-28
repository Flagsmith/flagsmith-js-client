const expect = require('expect');
const map = require('lodash/map');
const { mock } = require('./pact.server');
const addInteraction = require('./interaction-helper');

export default allTests => new Promise((resolve) => {
    // Execute all the tests
    map(allTests, (tests) => {
        const { path: testsPath } = tests;
        map(tests, (test, method) => {
            if (typeof test !== 'object') return;

            const { body, description, state, requestBody, path: testPath } = test;
            const path = testPath || testsPath;

            // Create test
            describe(description, () => {
                let req;

                // Mock the endpoint and add the interaction
                beforeEach(() => {
                    req = mock(path, method, body, requestBody);
                    return addInteraction({ state, requestBody, uponReceiving: description, body, method, path });
                });

                // add expectations
                it('returns a successful body', (done) => {
                    req()
                        .then(res => expect(res).toEqual(body))
                        .then(() => done());
                });
            });
        });
        resolve();
    });
});
