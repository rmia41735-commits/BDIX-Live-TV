# BIGG BOSS Playback Preview — Integration Notes

This branch contains a reusable playback controller only. The existing production UI is unchanged.

## Six channels
Bangla, Hindi, Telugu, Malayalam, Tamil, Kannada.

## Wiring into the existing UI
1. Import `createBiggBossPlayer` into the viewer's video player component.
2. Pass its existing `<video>` element and a status callback.
3. Resolve each channel's **authorized** HTTPS HLS URL from the existing authenticated viewer API.
4. On the channel Play button, call `controller.play(authorizedUrl)`.
5. Display `LIVE` only when the callback state is `playing`; otherwise show loading, buffering, ready, or unavailable.
6. Call `controller.stop()` when switching channels and `destroy()` on unmount.
7. For Chrome/Firefox, supply the `Hls` constructor from the project's installed `hls.js` dependency. Safari supports native HLS.

## Constraints
- No Hotstar tokens, cookies, DRM keys, or spoofed headers are included.
- Existing uploaded sources have expired authentication and cannot be declared playable.
- Browser CORS and service access restrictions must be honored.
- DASH/DRM content requires an authorized provider SDK and entitlement.
- No production deployment is included.
