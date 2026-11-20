# Bigg Boss Bangla — offline viewer integration

This repository does not contain the deployed BDIX PLAY TV viewer application source. The existing `player.html` is a standalone Gmax-JioTV player and is not the BDIX PLAY TV channel catalog. The preview here is a self-contained viewer card, not a production deployment.

## Included
- `bigg-boss-bangla.channel.json`: offline metadata, no playback URL
- `bigg-boss-bangla-card.js` and `.css`: reusable card with disabled button when offline
- `bigg-boss-bangla-preview.html`: local preview

## Integrating into the actual viewer
Load channel metadata into the existing authenticated channel catalog. Render the card with `renderBiggBossBanglaCard(mount, channel, {onSelect})`. When offline, the Watch button is disabled. For a licensed browser-playable HLS source, set `enabled: true`, `status: "online"`, and `streamUrl` to an authorized HTTPS URL in the trusted catalog, then pass selection to the existing player. A URL alone is not proof of playback availability: verify entitlement, browser CORS, media manifest and actual playback.

The reference website https://limon-iptv-pro.vercel.app/ could not be retrieved during this task, so no reference-site channel inventory or playback behavior has been verified. Do not use expired third-party cookies or tokens, DRM bypass, or origin spoofing.

## Authorized source supplied by owner (2026-11-20)
The owner confirmed authorization to use a Cloudflare Workers HLS URL with host `limon-iptv-link.limon-b.workers.dev` and path ending `.m3u8`. The full signed/opaque URL is intentionally **not** committed to this public repository: it may be a bearer credential and may expire.

The attempted direct fetch could not verify manifest access, stream identity, CORS, or playback. **Keep this channel offline until validated.**

### Production setup
1. In the actual private channel-management backend, save the full URL supplied by the owner as the protected stream URL for channel ID `bigg-boss-bangla`. Do not expose it in a public source repository, browser build environment variable, logs, or an unauthenticated API.
2. Validate that the URL returns a real HLS manifest, check media segments and CORS, and confirm that it is the intended Bangla broadcast. Respect the stream provider's access rules.
3. Make the channel catalog return `status: "online"` and `enabled: true` **only after** a successful source check. Serve a playable URL only to authorized viewers, following the provider's rules.
4. Render the existing viewer card and connect its Watch action to the existing authorized HLS player. Show OFFLINE again if playback or entitlement fails.
5. The Vercel production project and its actual viewer source are not confirmed to be connected to this GitHub repository. Do not claim this PR deploys the viewer.

No signed URLs, cookies, DRM secrets, or proxy bypasses are included in this repository.
