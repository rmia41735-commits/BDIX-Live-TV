/**
 * BDIX PLAY TV - authorized HLS playback controller.
 * No token extraction, custom Origin/Referer spoofing, DRM bypass, or proxy.
 * Supply a licensed browser-playable URL from your authorized backend.
 */
export function createBiggBossPlayer(video, onStatus = () => {}, HlsConstructor = globalThis.Hls) {
  if (!(video instanceof HTMLVideoElement)) throw new TypeError("Expected an HTMLVideoElement");
  let hls = null;
  let generation = 0;
  let retryCount = 0;
  let currentUrl = "";
  let retryTimer = null;
  const MAX_RETRIES = 2;
  const emit = (state, detail = "") => onStatus({ state, detail });
  const cleanup = () => {
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = null;
    if (hls) { hls.destroy(); hls = null; }
    video.pause();
    video.removeAttribute("src");
    video.load();
  };
  const play = async (url) => {
    if (!url || !/^https:\/\//i.test(url)) {
      emit("unavailable", "An authorized HTTPS playback source is required");
      return false;
    }
    const thisGeneration = ++generation;
    currentUrl = url;
    retryCount = 0;
    cleanup();
    emit("loading");
    const attach = async () => {
      if (thisGeneration !== generation) return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (HlsConstructor?.isSupported?.()) {
        hls = new HlsConstructor({ enableWorker: true, lowLatencyMode: true });
        hls.on(HlsConstructor.Events.ERROR, (_event, data) => {
          if (!data.fatal || thisGeneration !== generation) return;
          if (data.type === HlsConstructor.ErrorTypes.NETWORK_ERROR && retryCount < MAX_RETRIES) {
            retryCount++;
            emit("buffering", "Retrying network connection");
            retryTimer = setTimeout(() => {
              if (thisGeneration === generation) hls?.startLoad();
            }, retryCount * 1500);
          } else {
            emit("unavailable", "Stream unavailable or access restricted");
            cleanup();
          }
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        emit("unsupported", "HLS playback is not supported in this browser");
        return false;
      }
      try {
        await video.play();
        return true;
      } catch (error) {
        if (thisGeneration === generation) emit("ready", "Tap Play to start video");
        return false;
      }
    };
    return attach();
  };
  const handlePlaying = () => emit("playing");
  const handleWaiting = () => emit("buffering");
  const handleError = () => emit("unavailable", "Video could not be played");
  video.addEventListener("playing", handlePlaying);
  video.addEventListener("waiting", handleWaiting);
  video.addEventListener("error", handleError);
  return {
    play,
    stop() { generation++; cleanup(); emit("idle"); },
    destroy() {
      generation++; cleanup();
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleError);
    }
  };
}
