/* Non-invasive: adjusts ambient glow color only; never touches playback, URLs, EPG or authentication. */
(() => {
  'use strict';
  const palettes = [
    [/asian/i, '59, 145, 255'], [/bangla|bengali/i, '67, 177, 244'],
    [/hindi/i, '255, 116, 94'], [/kannada/i, '165, 112, 245'],
    [/malayalam/i, '53, 197, 155'], [/telugu/i, '245, 170, 72'],
    [/tamil/i, '230, 91, 145'], [/sports/i, '75, 215, 133'],
    [/news/i, '248, 99, 97']
  ];
  const fallback = '74, 151, 255';
  const apply = () => {
    document.querySelectorAll('.player-shell').forEach(shell => {
      if (!shell.classList.contains('bdix-ambient')) shell.classList.add('bdix-ambient');
      const title = shell.querySelector('#ch-name, .ch-name, .player-toolbar strong, .player-title, [data-channel-name]')?.textContent || '';
      const chosen = palettes.find(([pattern]) => pattern.test(title));
      const color = chosen ? chosen[1] : fallback;
      if (shell.style.getPropertyValue('--bdix-ambient-rgb') !== color)
        shell.style.setProperty('--bdix-ambient-rgb', color);
      if (shell.style.getPropertyValue('--bdix-ambient-strength') !== '.55')
        shell.style.setProperty('--bdix-ambient-strength', '.55');
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
