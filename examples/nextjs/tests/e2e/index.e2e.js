/* eslint no-console: 0 */
// All tests are run from this file, that way we can ensure ordering
// of tests (without needing to resort to alphabetical filenaming)
global.window = global;
require('dotenv').config();
const fork = require('child_process').fork;
const path = require('path');

const slackUpload = require('./slack-upload.test');

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const E2E_SLACK_CHANNEL = process.env.E2E_SLACK_CHANNEL;
let server;

global.testHelpers = require('./helpers.e2e');

module.exports = Object.assign(
    {
        // afterEach(browser, done) {
        //     browser.pause(1000)
        //     setTimeout(done,4000)
        // },
        before: (browser, done) => {
            server = fork('./server');
            server.on('message', () => {
                // cleardown any test data etc
                done();
            });
        },
        after: (browser, done) => {
            if (browser.sessionId) { //
                return browser.waitForElementPresent('#e2e-request',
                    () => browser.getText('#e2e-error', error => browser.getText('#e2e-request', (request) => {
                        if (error.value && error.value !== '{}') {
                            // Get last request + error info from the DOM
                            const lastRequest = request.value ? JSON.parse(request.value) : {};
                            const lastError = error.value ? JSON.parse(error.value) : {};
                            console.log('Last request:', lastRequest);
                            console.log('Last error:', lastError);

                            if (SLACK_TOKEN) { // if we have a slack_token variable upload it to slack
                                const uri = path.join(__dirname, 'screenshot.png');
                                browser.saveScreenshot(uri, () => {
                                    slackUpload(uri, `E2E Failed \n\`\`\`${JSON.stringify({
                                        request: lastRequest,
                                        error: lastError,
                                    }, null, 2).replace(/\\/g, '')}\`\`\``, E2E_SLACK_CHANNEL, 'Screenshot')
                                        .then(() => {
                                            server.kill('SIGINT');
                                            browser.end();
                                            done();
                                        });
                                });
                            }
                        } else {
                            console.log('E2E Passed!');
                            server.kill('SIGINT');
                            browser.end();
                            done();
                        }
                    })));
            }
            server.kill('SIGINT');
            browser.end();
            done();
        },
    },
    require('./main.e2e'), // Main flow tests
);
