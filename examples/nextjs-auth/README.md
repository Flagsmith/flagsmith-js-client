<p align="center"><img src="https://user-images.githubusercontent.com/2697570/126307277-d58c2d14-3ecf-4743-81ba-a9bcd7123e2c.png" width="64"/></p>

<h1 align="center">Flagsmith Next.js + Next-Auth  Example</h1>

### 🚀 Quick start

1. **Get Github OAuth Credentials**

- Go to Github Profile Settings → Developer Settings → OAuth Apps → New OAuth App.
- Fill the form with relevant data - Homepage Url([http://localhost:3000](http://localhost:3000/)), Authorization callback URL - [http://localhost:3000/api/auth/callback/github](http://localhost:3000/api/auth/callback/github)
- Generate Client Secret
- Copy Client Id and Secret, it will be used as env variables in .env.local file as `GITHUB_ID` and `GITHUB_SECRET`

2. **Get Flagsmith API Key**

Copy environment API key from the dashboard as displayed [here](https://docs.flagsmith.com/clients/javascript#basic-usage) 

3. **Create .env.local from .env.example**

Fill variables in the file from previous steps data.

```jsx
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FLAGSMITH_API_KEY=
```

4. **Install dependencies**

Use `npm install` command to install project dependencies.

5. **Run it**

```jsx
npm run dev
```

### 📚 Overview

The folder contains the example project made with a help of Next.js, Next-Auth, Tailwind CSS and [flagsmith-react](https://www.npmjs.com/package/flagsmith-react) library. Project shows how to use client-side feature flags. It is a more performance-friendly solution since it does not block the rendering of the content while flags are loading.
