# BDIX PLAY TV ambient lighting
Non-invasive 55% glow for .player-shell, based on channel title. No stream, login, or EPG changes.

Add to the **actual deployed application's** HTML after its existing player stylesheet and scripts:

```html
<link rel="stylesheet" href="/ambient-light.css">
<script defer src="/ambient-light.js"></script>
```

The currently deployed Vercel source is a separate `src/dist` build and is **not confirmed to be sourced from this repository**. Adding these files here does not activate the effect in production. The actual app must be updated and tested first. Do not redeploy the old Vercel build and claim the feature is live.
