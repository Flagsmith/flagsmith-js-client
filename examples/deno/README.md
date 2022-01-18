<img width="100%" src="https://raw.githubusercontent.com/Flagsmith/flagsmith/main/static-files/hero.png"/>

# Flagsmith Flags with Deno

This repository contains basic integration with Deno.

## Preinstall

```bash
brew install deno
```

## Developing

Note: although you don't need npm to run Deno, these scripts are here for convenience. If you wish to run in development
mode with nodemon reloading npm install.

```bash
npm i
FLAGSMITH="YOUR_ENV" npm run dev
```

## Bundling and running

```bash
FLAGSMITH="YOUR_ENV" npm start
```

Goto http://localhost:8000.
