# Bigg Boss Bangla — offline viewer integration

This repository does not contain the deployed BDIX PLAY TV viewer application source. The existing `player.html` is a standalone Gmax-JioTV player and is not the BDIX PLAY TV channel catalog. The preview here is a self-contained viewer card, not a production deployment.

## Included
- `bigg-boss-bangla.channel.json`: offline metadata, no playback URL
- `bigg-boss-bangla-card.js` and `.css`: reusable card with disabled button when offline
- `bigg-boss-bangla-preview.html`: local preview

## Integrating into the actual viewer
Load channel metadata into the existing authenticated channel catalog. Render the card with `renderBiggBossBanglaCard(mount, channel, {onSelect})`. When offline, the Watch button is disabled. For a licensed browser-playable HLS source, set `enabled: true`, `status: "online"`, and `streamUrl` to an authorized HTTPS URL in the trusted catalog, then pass selection to the existing player. A URL alone is not proof of playback availability: verify entitlement, browser CORS, media manifest and actual playback.

The reference website https://limon-iptv-pro.vercel.app/ could not be retrieved during this task, so no reference-site channel inventory or playback behavior has been verified. Do not use expired third-party cookies or tokens, DRM bypass, or origin spoofing.
