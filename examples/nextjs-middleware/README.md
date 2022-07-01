<img width="100%" src="https://raw.githubusercontent.com/Flagsmith/flagsmith/main/static-files/hero.png"/>

# Flagsmith Flags with Next.js middleware

This repository contains basic integration with Next.js middleware, selecting a user and clicking login will redirect the user to /login where middleware is run with flagsmith that identifies the user and evaluates a multivariate flag which determines where they are routed.

## Install
```bash
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
```
