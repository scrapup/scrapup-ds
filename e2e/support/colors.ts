/** Computed (Chromium) values of the brand color tokens, for toHaveCSS assertions. */
export const COLOR = {
  neon: 'rgb(255, 122, 51)',
  neonLight: 'rgb(232, 100, 31)',
  cyan: 'rgb(53, 230, 224)',
  // color-mix() tokens are serialized in the srgb color() notation (channels 0..1).
  cyanWash: 'color(srgb 0.207843 0.901961 0.878431 / 0.08)',
  ink: 'rgb(10, 13, 21)',
  fg2: 'rgb(236, 238, 244)',
  paperInk: 'rgb(26, 23, 20)',
  transparent: 'rgba(0, 0, 0, 0)',
} as const;
