# Local Evaluation (Server-Side Rules Engine)

## Overview

Local evaluation enables the Flagsmith SDK to evaluate feature flags locally using a rules engine, eliminating the need for per-request API calls. This is particularly beneficial for:

- **Server-Side Rendering (SSR)** - Next.js App Router, Remix, etc.
- **Serverless Functions** - AWS Lambda, Vercel, Netlify Functions
- **High-Traffic Applications** - Reduce API costs and latency
- **Offline Scenarios** - Evaluate flags without network connectivity

## How It Works

Instead of making an API request for every `getFlags()` call, the SDK:

1. Fetches an **environment document** once (contains all flags, segments, and rules)
2. Evaluates flags **locally** using the built-in rules engine
3. Optionally refreshes the environment document periodically (for long-running processes)

## Installation

The local evaluation engine is included in the standard Flagsmith SDK:

```bash
npm install @flagsmith/flagsmith
```

Dependencies:
- `crypto-js` - For MD5 hashing (percentage splits)
- `jsonpath` - For segment rule evaluation
- `semver` - For semantic version comparisons

## Basic Usage

### Option 1: Preloaded Environment Document (Recommended for SSR)

For optimal SSR performance, fetch the environment document once and reuse it:

```typescript
import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';

// Fetch environment document (once per instance/cold start)
const envDocResponse = await fetch(
  'https://edge.api.flagsmith.com/api/v1/environment-document/',
  {
    headers: {
      'X-Environment-Key': 'ser.your_server_side_key'
    }
  }
);
const environmentDocument = await envDocResponse.json();

// In your App Router layout or server component
const flagsmith = createFlagsmithInstance();
await flagsmith.init({
  evaluationContext: {
    environment: {
      apiKey: 'your_environment_id'
    }
  },
  enableLocalEvaluation: true,
  environmentDocument, // Preloaded - no API call during init
});

// Each request: zero API calls
const isFeatureEnabled = flagsmith.hasFeature('my_feature');
const featureValue = flagsmith.getValue('my_feature');
```

### Option 2: Fetch Environment Document During Init

For scenarios where you want the SDK to fetch the document:

```typescript
import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';

const flagsmith = createFlagsmithInstance();

await flagsmith.init({
  evaluationContext: {
    environment: {
      apiKey: 'your_environment_id'
    }
  },
  serverAPIKey: 'ser.your_server_side_key', // Note: "ser." prefix required
  enableLocalEvaluation: true,
  // SDK fetches environment document automatically
});

// Subsequent flag evaluations are local
const flags = flagsmith.getAllFlags();
```

## Identity-Based Evaluation

Local evaluation supports identity context for personalized flags:

```typescript
const flagsmith = createFlagsmithInstance();

await flagsmith.init({
  evaluationContext: {
    environment: {
      apiKey: 'your_environment_id'
    }
  },
  enableLocalEvaluation: true,
  environmentDocument,
});

// Evaluate flags for a specific user
await flagsmith.identify('user_123', {
  age: { value: 25 },
  country: { value: 'US' },
  subscription_tier: { value: 'premium' }
});

// Flags are evaluated based on user traits and segment rules
const flags = flagsmith.getAllFlags();
```

## Next.js App Router Example

```typescript
// app/layout.tsx
import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';

// Fetch environment document at module level (cached across requests)
const envDocPromise = fetch(
  process.env.FLAGSMITH_API_URL + '/environment-document/',
  {
    headers: {
      'X-Environment-Key': process.env.FLAGSMITH_SERVER_KEY!
    },
    next: { revalidate: 60 } // Next.js: revalidate every 60 seconds
  }
).then(r => r.json());

export default async function RootLayout({ children }) {
  const flagsmith = createFlagsmithInstance();

  await flagsmith.init({
    evaluationContext: {
      environment: {
        apiKey: process.env.NEXT_PUBLIC_FLAGSMITH_ENV_ID!
      }
    },
    enableLocalEvaluation: true,
    environmentDocument: await envDocPromise,
  });

  const showNewUI = flagsmith.hasFeature('new_ui');

  return (
    <html>
      <body>
        {showNewUI ? <NewUI>{children}</NewUI> : <OldUI>{children}</OldUI>}
      </body>
    </html>
  );
}
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `enableLocalEvaluation` | `boolean` | Yes | Enables local evaluation mode |
| `environmentDocument` | `object` | No* | Preloaded environment document (optimal for SSR) |
| `serverAPIKey` | `string` | No* | Server-side API key (fetches document automatically) |

\* Either `environmentDocument` or `serverAPIKey` must be provided.

## Environment Document API Endpoint

**Endpoint:** `GET /api/v1/environment-document/`

**Headers:**
- `X-Environment-Key`: Your server-side API key (prefix: `ser.`)

**Response:** JSON object containing:
- `feature_states` - All feature flag configurations
- `segments` - Segment definitions and rules
- `project` - Project and organization settings
- `identity_overrides` - Identity-specific overrides (if any)

## Segment Evaluation

The local evaluation engine supports all Flagsmith segment rules:

- **Trait matching** - `EQUAL`, `NOT_EQUAL`, `CONTAINS`, `NOT_CONTAINS`, `IN`, etc.
- **Numeric comparisons** - `GREATER_THAN`, `LESS_THAN`, `GREATER_THAN_INCLUSIVE`, etc.
- **Regex matching** - `REGEX` operator
- **Semantic versioning** - `SEMVER_EQUAL`, `SEMVER_GREATER_THAN`, etc.
- **Percentage splits** - `MODULO` operator for gradual rollouts
- **Nested rules** - `ALL`, `ANY`, `NONE` logic combinations

## Multivariate Flags

Multivariate flags with percentage-based variants are fully supported:

```typescript
// Environment has multivariate flag with 50/50 split: "variant_a" | "variant_b"
const variant = flagsmith.getValue('ab_test_feature');
// Returns deterministic variant based on user ID hash
```

## Performance Considerations

### SSR/Serverless Best Practices

1. **Preload environment document** at module level (outside request handler)
2. **Cache the document** using your platform's caching mechanism:
   - Next.js: `fetch()` with `next: { revalidate: N }`
   - Vercel: Edge Config or KV
   - AWS Lambda: Environment variables or Parameter Store
3. **Refresh periodically** (e.g., every 60 seconds) in long-running processes

### Memory Usage

- Environment document: ~10-100 KB (typical)
- Engine code: ~50 KB (minified)
- Evaluation overhead: <1ms per flag

## Troubleshooting

### "Environment document not loaded for local evaluation"

**Cause:** `getFlags()` called before environment document is fetched.

**Solution:** Ensure `await flagsmith.init()` completes before calling `getFlags()`.

### Flags differ between local and remote evaluation

**Cause:** Stale environment document.

**Solution:**
- Fetch a fresh document
- Check segment rules are correctly configured
- Verify trait data types match expectations

### BigInt errors in older browsers

**Cause:** The engine previously used BigInt for large number calculations.

**Solution:** This has been fixed in the isomorphic SDK. Ensure you're using the latest version.

## Limitations

- **Identity overrides from API not included** - The `/environment-document/` endpoint does not return per-identity overrides set via the dashboard. If you need these, use remote evaluation.
- **No real-time updates** - Changes in the Flagsmith dashboard require refetching the environment document (unlike streaming with remote evaluation).

## Migration from Remote Evaluation

To migrate existing code:

1. Add `enableLocalEvaluation: true` to `init()` config
2. Provide either `environmentDocument` or `serverAPIKey`
3. Remove any custom caching logic (no longer needed)
4. Test thoroughly - segment rules may behave differently with trait data type mismatches

## Cost Savings

**Example:** API-heavy SSR application

- **Before (Remote):** 100k requests/day × 30 days = 3M API calls/month
- **After (Local):** 1 call every 60s = 43k API calls/month
- **Reduction:** 98.6% fewer API calls

## Further Reading

- [Flagsmith Documentation](https://docs.flagsmith.com/)
- [Server-Side SDKs](https://docs.flagsmith.com/clients/server-side)
- [Local Evaluation Concept](https://docs.flagsmith.com/advanced-use/local-evaluation)
