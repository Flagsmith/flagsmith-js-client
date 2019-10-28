const { join } = require('path');
const cacheableResponse = require('cacheable-response');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    const sw = join(__dirname, '.next/service-worker.js');
    const favicon = join(__dirname, '/static/images/favicon.ico');

    server.get('/service-worker.js', (req, res) => {
        app.serveStatic(req, res, sw);
    });

    server.get('/favicon.ico', (req, res) => {
        app.serveStatic(req, res, favicon);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
