<img width="100%" src="https://raw.githubusercontent.com/Flagsmith/flagsmith/main/static-files/hero.png"/>

# Flagsmith with next.js and redux

This repository contains integration with next.js and Redux with SSR support.
Basic flow:

- _app.js (SERVER) awaits for Flagsmith to initialise and callback with flags
- _app.js (SERVER) triggers an action with the Flagsmith state
- reducer.js (SERVER) stores the Flagsmith state in an object called config
- pages/index.js (SERVER) renders markup after Flagsmith has data for getTrait, getValue etc

- _app.js (CLIENT) initialises Flagsmith on the client with the server state setState and registers an onChange function which triggers a redux action.

## Installation

```bash
npm i
```

## Running in development mode

```bash
npm run dev
```

## Running in production mode

```bash
npm run start
```
