/** Computed (Chromium) values of the brand color tokens, for toHaveCSS assertions. */
export const COLOR = {
  neon: 'rgb(255, 122, 51)',
  neonLight: 'rgb(232, 100, 31)',
  cyan: 'rgb(53, 230, 224)',
  // color-mix() tokens are serialized in the srgb color() notation (channels 0..1).
  cyanWash: 'color(srgb 0.207843 0.901961 0.878431 / 0.08)',
  ink: 'rgb(10, 13, 21)',
  fg2: 'rgb(236, 238, 244)',
  fg3: 'rgb(199, 204, 216)',
  fg4: 'rgb(174, 180, 194)',
  fg6: 'rgb(126, 133, 151)',
  textMuted: 'rgb(138, 144, 160)',
  textHeading: 'rgb(242, 243, 248)',
  magenta: 'rgb(255, 61, 166)',
  lineStrong: 'rgba(120, 190, 210, 0.3)',
  footerInk: 'rgb(154, 160, 176)',
  footerBand: 'rgb(7, 9, 14)',
  paperInk: 'rgb(26, 23, 20)',
  transparent: 'rgba(0, 0, 0, 0)',
} as const;

/** Prefix of any color-mix() glow derived from the neon accent (Chromium srgb serialization). */
export const NEON_GLOW = /color\(srgb 1 0\.478431 0\.2/;
