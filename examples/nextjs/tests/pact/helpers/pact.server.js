/* eslint no-console: 0 */
const bodyParser = require('body-parser');
const app = require('express')();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

module.exports = {
    mock(url, method, body, requestBody, headers = {}) {
        method = method.toLowerCase();
        app[method.toLowerCase()](url, (req, res) => {
            setTimeout(() => {
                res.json(body);
            }, 500);
        });
        const options = {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            method,
        };
        if (method !== 'get') {
            options.body = JSON.stringify(requestBody || {});
        }
        return () => fetch(global.api + url, options).then(res => res.json());
    },
    setup(port) {
        return new Promise((resolve) => {
            app.listen(process.env.MOCK_SERVER ? port : port + 1, () => {
                console.log('SERVER LISTENING', port);
                resolve();
            });

            app.get('/', (req, res) => {
                console.log(new Date());
                res.json({ status: 'OK', date: new Date() });
            });

            app.post('/', (req, res) => {
                console.log(req.body);
                res.json({ status: 'OK', date: new Date() });
            });
        });
    },
};
