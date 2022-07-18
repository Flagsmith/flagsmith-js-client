const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 3001;

let clients = [];
let facts = [];

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);


    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

app.get('/environment/:id', eventsHandler);

function sendEventsToAll(v) {
    console.log("Sending message to all clients")
    clients.forEach(client => client.response.write(`data: ${JSON.stringify({})}\n\n`))
}

async function triggerEvent(request, respsonse, next) {
    respsonse.send("1")
    return sendEventsToAll("1");
}

app.get('/trigger', triggerEvent);


app.listen(PORT, () => {
    console.log(`Facts Events service listening at http://localhost:${PORT}`)
})
