// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const next = require('next');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;
        // handle GET request to /service-worker.js
        if (pathname === '/service-worker.js') {
            const filePath = join(__dirname, 'dist', pathname);
            app.serveStatic(req, res, filePath);
        } else {
            handle(req, res, parsedUrl);
        }
    }).listen(PORT, (err) => {
        if (err) throw err;
        console.log('Ready on http://localhost:3000');
        // Send a message to ensure E2E knows the server is ready
        if (process.send) {
            process.send('Ready');
        }
    });
});
